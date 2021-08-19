import { asObject, asString } from 'cleaners'
import {
  differenceInMilliseconds,
  formatISO,
  parseISO,
  startOfTomorrow
} from 'date-fns'
import { EdgeCurrencyWallet } from 'edge-core-js'
import fetch from 'node-fetch'

import { config } from './config'

const bs = require('biggystring')

interface ExchangeRateInfo {
  [currencyCode: string]: string
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

      // Check if the response was successful or if the exchange rate is a valid number
      if (!response.ok || isNaN(parseFloat(exchangeRate))) {
        throw new TypeError(fetchErrorMsg + currencyCode)
      }

      return { [currencyCode]: exchangeRate }
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
  start: string,
  end: string
): Promise<string> => {
  if (
    bs.gt(start, end) === true ||
    !isFinite(parseFloat(start)) ||
    !isFinite(parseFloat(end))
  )
    throw new Error('Invalid start/end parameter(s)')
  while (bs.lte(start, end) === true) {
    const sum = bs.add(start, end)
    const mid = bs.div(sum, '2')

    const isSuccessfulResponse: boolean = await dataFetchFn(mid)

    if (!isSuccessfulResponse) {
      start = bs.add(mid, '1')
    } else {
      end = bs.sub(mid, '1')
    }
  }
  return start
}

export const msUntilStartNextDayUTC = (): number => {
  const currentTime = new Date()
  const tomorrowLocalTimezone = startOfTomorrow()
  const tomorrowDateStr = formatISO(tomorrowLocalTimezone, {
    representation: 'date'
  })
  const tomorrowUTCDate = parseISO(tomorrowDateStr + 'T00:00:00.000Z')
  return differenceInMilliseconds(tomorrowUTCDate, currentTime)
}

export const snooze = async (ms: number): Promise<void> =>
  await new Promise((resolve: Function) => setTimeout(resolve, ms))
