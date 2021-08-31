import Big from 'big.js'
import { asObject, asString } from 'cleaners'
import { asCouchDoc } from 'edge-server-tools'
import { DB } from 'nano'

import { config } from './config'

const asSwapInfoData = asObject({
  data: asObject(asString)
})

interface SwapInfo {
  [currencyPair: string]: string
}

const asCouchSwapInfoData = asCouchDoc(asSwapInfoData)

export const fetchSwapInfoDocs = async (
  database: DB,
  plugins: string[]
): Promise<any[]> => {
  const docPromisesArr = plugins.map(async pluginName =>
    database.get(pluginName)
  )
  return await Promise.all(docPromisesArr)
}

export const cleanSwapInfoDocs = (docs: any[]): SwapInfo[] => {
  return docs.reduce((res, currentDoc) => {
    try {
      const {
        doc: { data }
      } = asCouchSwapInfoData(currentDoc)
      return [...res, data]
    } catch {
      return res
    }
  }, [])
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
      const currentMin = Big(swapInfoMins[currencyPair])
      if (
        swapInfoMins[currencyPair] == null ||
        currentMin.gt(swapInfo[currencyPair])
      ) {
        swapInfoMins[currencyPair] = swapInfo[currencyPair]
      }
    })
  })
  return swapInfoMins
}

export const getSwapInfo = async (
  dbSwap: any,
  plugins: string[] | null,
  currencies: string[] | null
): Promise<SwapInfo> => {
  if (plugins === null) {
    plugins = Object.keys(config.plugins).filter(
      plugin => typeof config.plugins[plugin] === 'object'
    )
  }
  const swapInfoDocs = await fetchSwapInfoDocs(dbSwap, plugins)
  const cleanedSwapInfo = cleanSwapInfoDocs(swapInfoDocs)

  const filteredSwapInfo =
    currencies === null
      ? cleanedSwapInfo
      : cleanedSwapInfo.map(pluginSwapInfo =>
          filterSwapInfoData(pluginSwapInfo, currencies)
        )

  const swapInfoMins = findSwapInfoMins(filteredSwapInfo)

  return swapInfoMins
}
