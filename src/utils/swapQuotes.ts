import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapQuote
} from 'edge-core-js'

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
  const swapRequest = {
    fromWallet: currencyWallets[0],
    toWallet: currencyWallets[1],
    fromCurrencyCode: currencyWallets[0].currencyInfo.currencyCode,
    toCurrencyCode: currencyWallets[1].currencyInfo.currencyCode,
    nativeAmount: '1000000',
    quoteFor: 'from' as const
  }

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
