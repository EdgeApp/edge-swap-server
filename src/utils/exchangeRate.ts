interface ExchangeRateInfo {
  [currencyCode: string]: string
}

export const fetchExchangeRates = async (
  currencyPairs: Array<{ currency_pair: string }>
): Promise<ExchangeRateInfo> => ({
  BTC: '0.00002069',
  DOGE: '3.35085718',
  ETH: '0.00031066',
  LTC: '0.00565936',
  XRP: '0.85024416'
})
