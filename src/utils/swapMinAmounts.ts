import { asNumber, asString } from 'cleaners'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapQuote,
  EdgeSwapRequest
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

export async function swapQuotes(
  account: EdgeAccount,
  currencyWallets: EdgeCurrencyWallet[]
): Promise<EdgeSwapQuote[]> {
  // Enable all swap plugins
  for (const swapPluginConfig of Object.values(account.swapConfig)) {
    await swapPluginConfig.changeEnabled(true)
  }

  // Create an EdgeSwapRequest
  // NOTE: This is a placeholder that will be replaced in the future
  const swapReqParams: SwapReqInfo = {
    fromWallet: currencyWallets[0],
    toWallet: currencyWallets[1],
    amount: 1000000
  }

  const swapRequest = asFromSwapRequest(swapReqParams)

  // Get an array of all the swap plugin names
  const swapPluginNamesArr = Object.keys(account.swapConfig)

  // Create a variable to store the swap quotes
  const swapQuoteArr: EdgeSwapQuote[] = []

  // Loop over each plugin to attempt to get a swap quote
  for (const plugin of swapPluginNamesArr) {
    try {
      const disabledPluginMap = createDisabledSwapPluginMap(
        plugin,
        swapPluginNamesArr
      )
      const requestOptions = { disabled: disabledPluginMap }
      const quote = await account.fetchSwapQuote(swapRequest, requestOptions)
      swapQuoteArr.push(quote)
    } catch (e) {
      console.log(e)
    }
  }

  return swapQuoteArr
}
