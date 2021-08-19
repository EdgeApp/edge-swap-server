import { asObject, asString } from 'cleaners'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapRequest
} from 'edge-core-js'

import { binarySearch, fetchExchangeRates } from './utils'

const bs = require('biggystring')

interface SwapReqInfo {
  fromWallet: EdgeCurrencyWallet
  toWallet: EdgeCurrencyWallet
  amount: string
}

interface SwapQuoteParam {
  fromCurrencyWallet: EdgeCurrencyWallet
  toCurrencyWallet: EdgeCurrencyWallet
  plugin: string
}

interface MinAmountInfo {
  minAmount: string
  currencyPair: string
  plugin: string
}

const INIT_START = '0'
const INIT_END_USD_AMOUNT = '200' // Variable to help get initial binary search end in USD

const asMinAmountResponse = asObject({
  status: asString,
  value: asString
})

export const asFromSwapRequest = (reqParams: SwapReqInfo): EdgeSwapRequest => {
  const { fromWallet, toWallet, amount } = reqParams
  if (fromWallet == null || toWallet == null) {
    throw new TypeError('An invalid wallet was passed as a parameter')
  }
  return {
    fromWallet,
    toWallet,
    fromCurrencyCode: asString(fromWallet.currencyInfo.currencyCode),
    toCurrencyCode: asString(toWallet.currencyInfo.currencyCode),
    nativeAmount: asString(amount),
    quoteFor: 'from' as const
  }
}

export const createDisabledSwapPluginMap = (
  plugin: string,
  swapPluginNamesArr: string[]
): EdgePluginMap<true> => {
  return swapPluginNamesArr.reduce((currentPluginMap, currentPluginName) => {
    return plugin !== currentPluginName
      ? { ...currentPluginMap, [currentPluginName]: true }
      : currentPluginMap
  }, {})
}

export async function swapMinAmounts(
  account: EdgeAccount,
  currencyWallets: EdgeCurrencyWallet[]
): Promise<MinAmountInfo[]> {
  // Enable all swap plugins
  const enablePluginPromises = Object.values(account.swapConfig).map(
    async plugin => await plugin.changeEnabled(true)
  )
  await Promise.all(enablePluginPromises)

  // Fetch exchange rates for wallets
  const exchangeRates = await fetchExchangeRates(currencyWallets)

  // Get an array of all the swap plugin names
  const swapPluginNamesArr = Object.keys(account.swapConfig)

  const swapQuoteParamArr: SwapQuoteParam[] = []

  for (const fromCurrencyWallet of currencyWallets) {
    for (const toCurrencyWallet of currencyWallets) {
      if (fromCurrencyWallet === toCurrencyWallet) continue
      for (const plugin of swapPluginNamesArr) {
        swapQuoteParamArr.push({
          fromCurrencyWallet,
          toCurrencyWallet,
          plugin
        })
      }
    }
  }

  const minAmountPromiseArr = swapQuoteParamArr.map(async swapQuoteParam => {
    const { fromCurrencyWallet, toCurrencyWallet, plugin } = swapQuoteParam
    const disabledPluginMap = createDisabledSwapPluginMap(
      plugin,
      swapPluginNamesArr
    )
    const requestOptions = { disabled: disabledPluginMap }
    const swapQuoteAtOrAboveMin = async (
      nativeAmount: string
    ): Promise<boolean> => {
      try {
        const binarySearchSwapReq = asFromSwapRequest({
          fromWallet: fromCurrencyWallet,
          toWallet: toCurrencyWallet,
          amount: nativeAmount
        })
        await account.fetchSwapQuote(binarySearchSwapReq, requestOptions)
        return true
      } catch (e) {
        if (e.message !== 'Amount is too low') throw e
        return false
      }
    }

    const {
      currencyInfo: { currencyCode, denominations }
    } = fromCurrencyWallet

    const initEndCurrencyAmount = bs.mul(
      INIT_END_USD_AMOUNT,
      exchangeRates[currencyCode]
    )
    const initBinarySearchEnd = bs.mul(
      initEndCurrencyAmount,
      denominations[0].multiplier
    )

    return await binarySearch(
      swapQuoteAtOrAboveMin,
      INIT_START,
      initBinarySearchEnd
    )
  })

  const settledMinAmounts = await Promise.allSettled(minAmountPromiseArr)

  const minAmountArr: MinAmountInfo[] = []

  for (let i = 0; i < settledMinAmounts.length; i++) {
    if (settledMinAmounts[i].status === 'fulfilled') {
      try {
        const { value } = asMinAmountResponse(settledMinAmounts[i])
        const {
          fromCurrencyWallet: {
            currencyInfo: { currencyCode: fromCurrencyCode, denominations }
          },
          toCurrencyWallet: {
            currencyInfo: { currencyCode: toCurrencyCode }
          },
          plugin
        } = swapQuoteParamArr[i]
        const minAmountInt =
          parseInt(value) / parseInt(denominations[0].multiplier)
        minAmountArr.push({
          minAmount: minAmountInt.toString(),
          currencyPair: fromCurrencyCode + '_' + toCurrencyCode,
          plugin
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return minAmountArr
}
