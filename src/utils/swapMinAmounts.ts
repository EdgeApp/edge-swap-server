import { asNumber, asObject, asString } from 'cleaners'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapRequest
} from 'edge-core-js'

import { binarySearch } from './utils'

interface SwapReqInfo {
  fromWallet: EdgeCurrencyWallet
  toWallet: EdgeCurrencyWallet
  amount: number
}

interface SwapQuoteParam {
  fromCurrencyWallet: EdgeCurrencyWallet
  toCurrencyWallet: EdgeCurrencyWallet
  plugin: string
}

interface MinAmountInfo {
  minAmount: number
  currencyPair: string
  plugin: string
}

const asMinAmountResponse = asObject({
  status: asString,
  value: asNumber
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
    nativeAmount: asNumber(amount).toString(),
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

  // Initial parameters for findMinSwapAmount
  // NOTE: This is a placeholder that will be replaced in the future
  const initBinarySearchMin = 0
  const initBinarySearchMax = 1000000
  const fromCurrencyWallet = currencyWallets[0]
  const toCurrencyWallet = currencyWallets[1]

  // Get an array of all the swap plugin names
  const swapPluginNamesArr = Object.keys(account.swapConfig)

  const swapQuoteParamArr: SwapQuoteParam[] = []

  for (const plugin of swapPluginNamesArr) {
    swapQuoteParamArr.push({
      fromCurrencyWallet,
      toCurrencyWallet,
      plugin
    })
  }

  const minAmountPromiseArr = swapQuoteParamArr.map(async swapQuoteParam => {
    const { fromCurrencyWallet, toCurrencyWallet, plugin } = swapQuoteParam
    const disabledPluginMap = createDisabledSwapPluginMap(
      plugin,
      swapPluginNamesArr
    )
    const requestOptions = { disabled: disabledPluginMap }
    const swapQuoteAtOrAboveMin = async (
      nativeAmount: number
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

    return await binarySearch(
      swapQuoteAtOrAboveMin,
      initBinarySearchMin,
      initBinarySearchMax
    )
  })

  const settledMinAmounts = await Promise.allSettled(minAmountPromiseArr)

  const minAmountArr: MinAmountInfo[] = []

  for (let i = 0; i < settledMinAmounts.length; i++) {
    if (settledMinAmounts[i].status === 'fulfilled') {
      try {
        const { value } = asMinAmountResponse(settledMinAmounts[i])
        const {
          fromCurrencyWallet,
          toCurrencyWallet,
          plugin
        } = swapQuoteParamArr[i]
        minAmountArr.push({
          minAmount: value,
          currencyPair:
            fromCurrencyWallet.currencyInfo.currencyCode +
            '_' +
            toCurrencyWallet.currencyInfo.currencyCode,
          plugin
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return minAmountArr
}
