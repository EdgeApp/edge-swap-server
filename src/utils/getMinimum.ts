import { asObject, asString } from 'cleaners'
import { asCouchDoc } from 'edge-server-tools'
import { DB } from 'nano'

import { config } from './config'
// import { ErrorResponse, makeErrorResponse } from './errorResponse'

// interface MinAmountInfo {
//   currencyPair: string
//   minAmount: string
// }

const asSwapInfoData = asObject({
  data: asObject(asString)
})

interface SwapInfo {
  [pluginName: string]: {
    [currencyPair: string]: string
  }
}

const asCouchSwapInfoData = asCouchDoc(asSwapInfoData)

// const CurrencyPairDataError: ErrorResponse = makeErrorResponse(
//   'not_found',
//   404,
//   'Data for currencyPair not found'
// )

export const fetchSwapInfoDocs = async (database: DB): Promise<any[]> => {
  // Array of promises to get the documents of the same key per database
  const docPromisesArr = Object.keys(config.plugins)
    .filter(plugin => typeof config.plugins[plugin] === 'object')
    .map(async pluginName => database.get(pluginName))
  // Capture the result of each promise, including whether it was fulfilled or rejected
  return await Promise.allSettled(docPromisesArr)
}

export const cleanSwapInfoDocs = (docs: any[]): SwapInfo => {
  return docs.reduce((res, currentDoc) => {
    try {
      const {
        id,
        doc: { data }
      } = asCouchSwapInfoData(currentDoc.value)
      return { ...res, [id]: data }
    } catch {
      return res
    }
  }, {})
}

// export const findMinimum = (
//   minAmountDataArr: Array<ReturnType<typeof asMinAmountData>>
// ): string | ErrorResponse => {
//   // Use 'reduce' to go through array of data objects and find the lowest minAmount amongst the plugins
//   const minAmountFloat = minAmountDataArr.reduce(
//     (currentMinAmount, currentMinAmountDataObj) => {
//       const pluginMinAmount = parseFloat(currentMinAmountDataObj.minAmount) // Grab the plugin's minAmount for the currencyPair
//       // If the plugin's minAmount is lower than currentMinAmount, update currentMinAmount
//       return pluginMinAmount < currentMinAmount && pluginMinAmount > 0
//         ? pluginMinAmount
//         : currentMinAmount
//     },
//     Infinity
//   ) // Start currentMinAmount at Infinity

//   // Check if minAmountFloat is not a finite number (Infinity, -Infinity, NaN)
//   if (!isFinite(minAmountFloat)) {
//     // No data could be found in the database, return an object with the error info
//     return CurrencyPairDataError
//   }

//   return minAmountFloat.toString()
// }

export const checkDbAndFindMinAmount = async (dbSwap: any): Promise<any> => {
  const swapInfoDocs = await fetchSwapInfoDocs(dbSwap)
  const cleanSwapInfoData = cleanSwapInfoDocs(swapInfoDocs)
  // const minAmountResult = findMinimum(cleanSwapInfoData)

  // if (typeof minAmountResult !== 'string') {
  //   throw minAmountResult // minAmountResult is equal to CurrencyPairDataError
  // }

  return cleanSwapInfoData
}
