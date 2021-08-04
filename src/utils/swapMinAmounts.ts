import { asNumber, asObject, asString } from 'cleaners'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapRequest,
  EdgeSwapRequestOptions
} from 'edge-core-js'
import fetch from 'node-fetch'

import { config } from './config'

interface SwapReqInfo {
  fromWallet: EdgeCurrencyWallet
  toWallet: EdgeCurrencyWallet
  amount: number
}

interface SingleCurrencyPairMinAmt {
  [pluginName: string]: number
}

const baseUri: string = config.ratesServerAddress
const route: string = 'v1/exchangeRate/'
const queryStr: string = '?currency_pair=USD_'

const INIT_MIN = 0
const INIT_MAX_USD_AMOUNT = 200 // Variable to help get initial binary search max in USD

const asRatesServerResponse = asObject({
  currency_pair: asString,
  date: asString,
  exchangeRate: asString
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
): Promise<{ [key: string]: SingleCurrencyPairMinAmt }> {
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

  // Get an array of all the swap plugin names
  const swapPluginNamesArr = Object.keys(account.swapConfig)

  const allMinAmtsObj: { [key: string]: SingleCurrencyPairMinAmt } = {}

  // Loop over the currency wallets for the different source currencies
  for (const fromCurrencyWallet of currencyWallets) {
    try {
      const fromWalletCurrencyCode: string =
        fromCurrencyWallet.currencyInfo.currencyCode
      const response = await fetch(
        baseUri + route + queryStr + fromWalletCurrencyCode
      )
      const { exchangeRate } = asRatesServerResponse(await response.json())
      const initBinarySearchMax = Math.ceil(
        INIT_MAX_USD_AMOUNT *
          parseFloat(exchangeRate) *
          parseInt(fromCurrencyWallet.currencyInfo.denominations[0].multiplier)
      )

      // Loop over the currency wallets for the different destination currencies
      for (const toCurrencyWallet of currencyWallets) {
        if (fromCurrencyWallet === toCurrencyWallet) continue

        const toWalletCurrencyCode: string =
          toCurrencyWallet.currencyInfo.currencyCode

        const currencyPair: string =
          fromWalletCurrencyCode + '_' + toWalletCurrencyCode

        // Create a variable to store the swap quotes with the plugin name as the key
        const singleCurrencyPairMinAmtObj: SingleCurrencyPairMinAmt = {}

        // Loop over each plugin to attempt to get a swap quote
        for (const plugin of swapPluginNamesArr) {
          try {
            const disabledPluginMap = createDisabledSwapPluginMap(
              plugin,
              swapPluginNamesArr
            )
            const requestOptions = { disabled: disabledPluginMap }
            singleCurrencyPairMinAmtObj[plugin] = await findMinSwapAmount(
              INIT_MIN,
              initBinarySearchMax,
              fromCurrencyWallet,
              toCurrencyWallet,
              requestOptions
            )
          } catch (e) {
            console.log(e)
          }
        }

        allMinAmtsObj[currencyPair] = singleCurrencyPairMinAmtObj
      }
    } catch (e) {
      console.log(e)
    }
  }

  return allMinAmtsObj
}
