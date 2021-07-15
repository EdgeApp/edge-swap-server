import { asObject, asOptional, asString } from 'cleaners'

import { ErrorResponse, makeErrorResponse } from './errorResponse'

const asMinAmountDoc = asObject({
  status: asString,
  value: asObject({
    _id: asString,
    _rev: asOptional(asString),
    data: asObject({ minAmount: asString })
  })
})

const CurrencyPairDataError: ErrorResponse = makeErrorResponse(
  'not_found',
  404,
  'Data for currencyPair not found'
)

export const findMinimum = (docs: any[]): string | ErrorResponse => {
  // Use 'reduce' to go through settled promises and find the lowest minAmount amongst the plugins
  const minAmountFloat = docs.reduce((currentMinAmount, doc) => {
    try {
      const cleanedDoc = asMinAmountDoc(doc) // Clean settled promise for a MinAmountDoc
      const pluginMinAmount = parseFloat(cleanedDoc.value.data.minAmount) // Grab the plugin's minAmount for the currencyPair
      // If the plugin's minAmount is lower than currentMinAmount, update currentMinAmount
      return pluginMinAmount < currentMinAmount
        ? pluginMinAmount
        : currentMinAmount
    } catch {
      // Promise was rejected or fulfilled promise returned invalid data
      return currentMinAmount
    }
  }, Infinity) // Start currentMinAmount at Infinity

  // Check if minAmountFloat is not a finite number (Infinity, -Infinity, NaN)
  if (!isFinite(minAmountFloat)) {
    // No data could be found in the database, return an object with the error info
    return CurrencyPairDataError
  }

  return minAmountFloat.toString()
}
