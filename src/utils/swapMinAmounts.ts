import { asNumber, asString } from 'cleaners'
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
): Promise<{ [key: string]: number }> {
  // Enable all swap plugins
  for (const swapPluginConfig of Object.values(account.swapConfig)) {
    await swapPluginConfig.changeEnabled(true)
  }

  // Initial parameters for findMinSwapAmount
  // NOTE: This is a placeholder that will be replaced in the future
  const initBinarySearchMin = 0
  const initBinarySearchMax = 1000000
  const fromCurrencyWallet = currencyWallets[0]
  const toCurrencyWallet = currencyWallets[1]

  // Get an array of all the swap plugin names
  const swapPluginNamesArr = Object.keys(account.swapConfig)

  // Create a variable to store the swap quotes with the plugin name as the key
  const minAmountObj: { [key: string]: number } = {}

  // Loop over each plugin to attempt to get a swap quote
  for (const plugin of swapPluginNamesArr) {
    try {
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
      minAmountObj[plugin] = await binarySearch(
        swapQuoteAtOrAboveMin,
        initBinarySearchMin,
        initBinarySearchMax
      )
    } catch (e) {
      console.log(e)
    }
  }

  return minAmountObj
}
