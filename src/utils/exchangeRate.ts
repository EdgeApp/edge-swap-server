import { EdgeRateHint } from 'edge-core-js'
import edgeExchangePlugins from 'edge-exchange-plugins'
import fetch from 'node-fetch'

import { config } from './config'

const log = {
  error(str) {
    console.log(str)
  },
  warn(str) {
    console.log(str)
  }
}

interface ExchangeRateInfo {
  [currencyCode: string]: string
}

const asExchangeRateInfo = (rateResponse: any): ExchangeRateInfo => {
  return rateResponse.reduce((res, { toCurrency, rate }) => {
    const currencyCode = toCurrency.replace(config.currencyPrefix, '')
    return {
      ...res,
      [currencyCode]: rate.toString()
    }
  }, {})
}

const edgeRatesPlugin = edgeExchangePlugins.edgeRates({ io: { fetch }, log })

export const fetchExchangeRates = async (
  rateHints: EdgeRateHint[]
): Promise<ExchangeRateInfo> => {
  try {
    const rates = await edgeRatesPlugin.fetchRates(rateHints)
    return asExchangeRateInfo(rates)
  } catch (e) {
    console.log(e)
    return {}
  }
}
