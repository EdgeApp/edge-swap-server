import Big from 'big.js'
import { asNumber, asObject, asString } from 'cleaners'
import { asCouchDoc } from 'edge-server-tools'
import { DB } from 'nano'

import { hgetallAsync, updateCache } from '../updateCache'
import { config } from './config'

const asSwapInfoData = asObject({
  data: asObject(asString)
})

const asCouchSwapInfoData = asCouchDoc(asSwapInfoData)

const asTimestampData = asObject({
  data: asObject(asNumber)
})

const asCouchTimestampData = asCouchDoc(asTimestampData)

export interface AllSwapInfo {
  [pluginName: string]: SwapInfo
}

export interface SwapInfo {
  [currencyPair: string]: string
}

export const fetchSwapInfoDocs = async (
  database: DB,
  plugins: string[]
): Promise<any[]> => {
  const docPromisesArr = plugins.map(async pluginName =>
    database.get(pluginName)
  )
  return await Promise.all(docPromisesArr)
}

export const fetchSwapInfoCache = async (plugins: string[]): Promise<any[]> => {
  const cachePromisesArr = plugins.map(pluginName => hgetallAsync(pluginName))
  return await Promise.all(cachePromisesArr)
}

export const cleanSwapInfoDocs = (docs: any[]): AllSwapInfo => {
  return docs.reduce((res, currentDoc) => {
    try {
      const {
        id,
        doc: { data }
      } = asCouchSwapInfoData(currentDoc)
      return { ...res, [id]: data }
    } catch {
      return res
    }
  }, {})
}

export const filterSwapInfoData = (
  pluginSwapInfo: SwapInfo,
  currencies: string[]
): SwapInfo => {
  return Object.keys(pluginSwapInfo).reduce((res, currencyPair) => {
    return currencies.some(currency => currencyPair.includes(currency))
      ? { ...res, [currencyPair]: pluginSwapInfo[currencyPair] }
      : res
  }, {})
}

export const findSwapInfoMins = (swapInfos: SwapInfo[]): SwapInfo => {
  const swapInfoMins = {}
  swapInfos.forEach(swapInfo => {
    Object.keys(swapInfo).forEach(currencyPair => {
      try {
        const currentMin = swapInfoMins[currencyPair]
        const bigPluginMin = Big(swapInfo[currencyPair])
        if (currentMin == null || bigPluginMin.lt(currentMin)) {
          swapInfoMins[currencyPair] = swapInfo[currencyPair]
        }
      } catch (e) {
        console.log(e.message)
      }
    })
  })
  return swapInfoMins
}

export const getSwapInfo = async (
  dbSwap: any,
  plugins: string[] | null,
  currencies: string[] | null,
  cacheNeedsUpdate: boolean
): Promise<SwapInfo> => {
  if (plugins === null) {
    plugins = Object.keys(config.plugins).filter(
      plugin => typeof config.plugins[plugin] === 'object'
    )
  }
  let swapInfoArr
  if (cacheNeedsUpdate) {
    const swapInfoDocs = await fetchSwapInfoDocs(dbSwap, plugins)
    const cleanedSwapInfo = cleanSwapInfoDocs(swapInfoDocs)
    swapInfoArr = Object.values(cleanedSwapInfo)

    const timestampDoc = await dbSwap.get('-timestamp')
    const {
      doc: {
        data: { timestamp }
      }
    } = asCouchTimestampData(timestampDoc)

    await updateCache(cleanedSwapInfo, timestamp)
  } else {
    swapInfoArr = await fetchSwapInfoCache(plugins)
  }

  const filteredSwapInfo =
    currencies === null
      ? swapInfoArr
      : swapInfoArr.map(pluginSwapInfo =>
          filterSwapInfoData(pluginSwapInfo, currencies)
        )

  return findSwapInfoMins(filteredSwapInfo)
}
