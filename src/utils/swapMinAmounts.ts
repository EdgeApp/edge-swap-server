import { asNumber, asString } from 'cleaners'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapRequest,
  EdgeSwapRequestOptions
} from 'edge-core-js'

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
  // Helper function to find minimum swap amount
  const findMinSwapAmount = async (
    min: number,
    max: number,
    fromWallet: EdgeCurrencyWallet,
    toWallet: EdgeCurrencyWallet,
    reqOptions: EdgeSwapRequestOptions
  ): Promise<number> => {
    // Throw error if min is larger than max + 1
    if (min > max + 1) throw new Error('The min is greater than the max')

    // Eventually max is going to be below the minimum swap amount by 1
    if (min === max + 1) {
      const { multiplier } = fromWallet.currencyInfo.denominations[0]
      return min / parseInt(multiplier)
    }

    const middle: number = Math.floor((min + max) / 2)
    const binarySearchSwapReq = asFromSwapRequest({
      fromWallet,
      toWallet,
      amount: middle
    })

    return await account
      .fetchSwapQuote(binarySearchSwapReq, reqOptions)
      .then(async successfulRequest => {
        return await findMinSwapAmount(
          min,
          middle - 1,
          fromWallet,
          toWallet,
          reqOptions
        )
      })
      .catch(async error => {
        if (error.message !== 'Amount is too low') throw error
        return await findMinSwapAmount(
          middle + 1,
          max,
          fromWallet,
          toWallet,
          reqOptions
        )
      })
  }

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
      minAmountObj[plugin] = await findMinSwapAmount(
        initBinarySearchMin,
        initBinarySearchMax,
        fromCurrencyWallet,
        toCurrencyWallet,
        requestOptions
      )
    } catch (e) {
      console.log(e)
    }
  }

  return minAmountObj
}
