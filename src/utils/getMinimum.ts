import { asObject, asString } from 'cleaners'
import { asCouchDoc } from 'edge-server-tools'

import { ErrorResponse, makeErrorResponse } from './errorResponse'
import { fetchSameKeyDocs } from './utils'

interface MinAmountInfo {
  currencyPair: string
  minAmount: string
}

const asMinAmountData = asObject({ minAmount: asString })

const asMinAmountDocData = asObject({
  data: asMinAmountData
})

const asCouchMinAmountDocData = asCouchDoc(asMinAmountDocData)

const CurrencyPairDataError: ErrorResponse = makeErrorResponse(
  'not_found',
  404,
  'Data for currencyPair not found'
)

export const cleanMinAmountDocs = (
  docs: any[]
): Array<ReturnType<typeof asMinAmountData>> => {
  return docs.reduce((minAmountDocDataArr, currentDoc) => {
    try {
      const {
        doc: { data }
      } = asCouchMinAmountDocData(currentDoc.value)
      return [...minAmountDocDataArr, data]
    } catch {
      return minAmountDocDataArr
    }
  }, [])
}

export const findMinimum = (
  minAmountDataArr: Array<ReturnType<typeof asMinAmountData>>
): string | ErrorResponse => {
  // Use 'reduce' to go through array of data objects and find the lowest minAmount amongst the plugins
  const minAmountFloat = minAmountDataArr.reduce(
    (currentMinAmount, currentMinAmountDataObj) => {
      const pluginMinAmount = parseFloat(currentMinAmountDataObj.minAmount) // Grab the plugin's minAmount for the currencyPair
      // If the plugin's minAmount is lower than currentMinAmount, update currentMinAmount
      return pluginMinAmount < currentMinAmount && pluginMinAmount > 0
        ? pluginMinAmount
        : currentMinAmount
    },
    Infinity
  ) // Start currentMinAmount at Infinity

  // Check if minAmountFloat is not a finite number (Infinity, -Infinity, NaN)
  if (!isFinite(minAmountFloat)) {
    // No data could be found in the database, return an object with the error info
    return CurrencyPairDataError
  }

  return minAmountFloat.toString()
}

export const checkDbAndFindMinAmount = async (
  currencyPair: string,
  dbSwap: any
): Promise<MinAmountInfo> => {
  const minAmountDocs = await fetchSameKeyDocs(dbSwap)
  const cleanMinAmountData = cleanMinAmountDocs(minAmountDocs)
  const minAmountResult = findMinimum(cleanMinAmountData)

  if (typeof minAmountResult !== 'string') {
    throw minAmountResult // minAmountResult is equal to CurrencyPairDataError
  }

  return {
    currencyPair,
    minAmount: minAmountResult
  }
}
