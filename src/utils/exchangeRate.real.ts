import { asArray, asNumber, asObject, asOptional, asString } from 'cleaners'
import fetch from 'node-fetch'

import { config } from './config'

interface ExchangeRateInfo {
  [currencyCode: string]: string
}

const { currencyPairPrefix, ratesServerAddress } = config
const route = '/v2/exchangeRates'

const asErrorResponse = asObject({
  errorCode: asOptional(asNumber),
  errorType: asOptional(asString)
})

const asRateServerResponse = asObject({
  currency_pair: asString,
  date: asString,
  exchangeRate: asOptional(asString),
  error: asOptional(asErrorResponse)
})

const asRateServerResponses = asObject({
  data: asArray(asRateServerResponse)
})

const asExchangeRateInfo = (rateResponse: any): ExchangeRateInfo => {
  const { data } = asRateServerResponses(rateResponse)

  return data.reduce(
    (res, { currency_pair: currencyPair, exchangeRate, error }) => {
      if (error != null || exchangeRate == null) return res
      const currencyCode = currencyPair.replace(currencyPairPrefix, '')
      return {
        ...res,
        [currencyCode]: exchangeRate
      }
    },
    {}
  )
}

export const fetchExchangeRates = async (
  currencyPairs: Array<{ currency_pair: string }>
): Promise<ExchangeRateInfo> => {
  try {
    const response = await fetch(`${ratesServerAddress}${route}`, {
      method: 'post',
      body: JSON.stringify(currencyPairs),
      headers: { 'Content-Type': 'application/json' }
    })
    // Check if the response was successful or if the exchange rate is a valid number
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (response == null || !response.ok) {
      throw new TypeError(
        `Invalid response: ${JSON.stringify(response, null, 2)}`
      )
    }

    return asExchangeRateInfo(await response.json())
  } catch (e) {
    console.log(e)
    return {}
  }
}
