interface ExchangeRateInfo {
  [currencyCode: string]: string
}

export const fetchExchangeRates = async (
  currencyPairs: Array<{ currency_pair: string }>
): Promise<ExchangeRateInfo> => ({
  BCH: '0.00155618',
  BNB: '0.0020514',
  BSV: '0.00585772',
  BTC: '0.00002066',
  DASH: '0.00419489',
  DOGE: '3.47099835',
  ETC: '0.01490632',
  ETH: '0.00026521',
  FIO: '4.55657135',
  LTC: '0.005487',
  USDC: '1',
  XLM: '2.83776801',
  XMR: '0.00330466',
  XRP: '0.82307673',
  XTZ: '0.18493335'
})
