import { asNumber, asObject, asString } from 'cleaners'
import { EdgeCurrencyWallet } from 'edge-core-js'
import fetch from 'node-fetch'

import { config } from './config'

interface ExchangeRateInfo {
  [currencyCode: string]: number
}

const baseUri: string = config.ratesServerAddress
const route = 'v1/exchangeRate/'
const queryStr = '?currency_pair=USD_'

const fetchErrorMsg = 'Cannot fetch valid exchange rate data for '

const asRatesServerResponse = asObject({
  currency_pair: asString,
  date: asString,
  exchangeRate: asString
})

export const fetchSameKeyDocs = async (
  key: string,
  docScopeArr: any[]
): Promise<any[]> => {
  // Array of promises to get the documents of the same key per database
  const docPromisesArr = docScopeArr.map(async database => database.get(key))
  // Capture the result of each promise, including whether it was fulfilled or rejected
  return await Promise.allSettled(docPromisesArr)
}

export const fetchExchangeRates = async (
  wallets: EdgeCurrencyWallet[]
): Promise<ExchangeRateInfo> => {
  const ratePromisesArr = wallets.map(async wallet => {
    const {
      currencyInfo: { currencyCode }
    } = wallet
    try {
      const response = await fetch(baseUri + route + queryStr + currencyCode)
      const { exchangeRate } = asRatesServerResponse(await response.json())
      const exchangeRateFloat = parseFloat(exchangeRate)

      // Check if the response was successful or if the exchange rate is a valid number
      if (!response.ok || isNaN(exchangeRateFloat)) {
        throw new TypeError(fetchErrorMsg + currencyCode)
      }

      return { [currencyCode]: exchangeRateFloat }
    } catch (e) {
      console.log(e)
    }
  })

  // Resolve array of promises for exchange rates
  const rates = await Promise.all(ratePromisesArr)
  const exchangeRatesObj = {}
  for (const rate of rates) {
    if (rate === undefined) continue
    Object.assign(exchangeRatesObj, rate)
  }
  return exchangeRatesObj
}

export const binarySearch = async (
  dataFetchFn: Function,
  start: number,
  end: number
): Promise<number> => {
  if (start > end || !isFinite(start) || !isFinite(end))
    throw new Error('Invalid start/end parameter(s)')
  while (asNumber(start) <= asNumber(end)) {
    const mid = Math.floor((start + end) / 2)

    const isSuccessfulResponse: boolean = await dataFetchFn(mid)

    if (!isSuccessfulResponse) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }
  return start
}
