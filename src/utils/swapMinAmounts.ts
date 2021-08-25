import Big from 'big.js'
import {
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  EdgeSwapRequest,
  EdgeSwapRequestOptions
} from 'edge-core-js'

import { binarySearch } from './utils'

const PRECISION = 18
const START_USD_AMOUNT = '0'
const DEFAULT_RATE = '1'
const END_USD_AMOUNT = '200' // Variable to help get initial binary search end in USD

interface MinAmounts {
  [currencyPair: string]: string
}

interface CurrencyWalletPair {
  currencyPair: string
  fromWallet: EdgeCurrencyWallet
  fromCurrencyCode: string
  fromRate: string
  toWallet: EdgeCurrencyWallet
  toCurrencyCode: string
  toRate: string
}

type BinaryFetchSwapQuote = (
  swapQuoteParams: EdgeSwapRequest,
  swapQuoteOpts: EdgeSwapRequestOptions
) => (amount: string) => Promise<boolean>

export const createBinarySwapQuote = (
  account: EdgeAccount
): BinaryFetchSwapQuote => (params, opts) => async amount => {
  try {
    await account.fetchSwapQuote({ ...params, nativeAmount: amount }, opts)
    return true
  } catch (e) {
    if (e.message !== 'Amount is too low') throw e
    return false
  }
}

export const createCurrencyPairs = (
  currencyWallets: EdgeCurrencyWallet[],
  exchangeRates: { [currencyCode: string]: string } = {}
): CurrencyWalletPair[] => {
  return currencyWallets
    .flatMap(toWallet =>
      currencyWallets.map(fromWallet => {
        const fromCode = fromWallet.currencyInfo.currencyCode
        const toCode = toWallet.currencyInfo.currencyCode
        return {
          fromWallet,
          fromCurrencyCode: fromCode,
          fromRate: exchangeRates[fromCode] ?? `${DEFAULT_RATE}`,
          toWallet,
          toCurrencyCode: toCode,
          toRate: exchangeRates[toCode] ?? `${DEFAULT_RATE}`,
          currencyPair: `${fromCode}_${toCode}`
        }
      })
    )
    .filter(
      ({ fromCurrencyCode, toCurrencyCode }) =>
        fromCurrencyCode !== toCurrencyCode
    )
}

export async function swapMinAmounts(
  pluginName: string,
  pluginMap: EdgePluginMap<true>,
  currencyWalletPairs: CurrencyWalletPair[],
  binaryFetchSwapQuote: BinaryFetchSwapQuote
): Promise<MinAmounts> {
  // Remove the current pluginName from the disabled list
  const { [pluginName]: _, ...disabled } = pluginMap
  // Initialize an empty response object
  const minAmounts = {}

  const minAmountsPromises = currencyWalletPairs.map(async walletPair => {
    const swapQuoteParams = {
      ...walletPair,
      quoteFor: 'from' as const,
      nativeAmount: `${START_USD_AMOUNT}`
    }
    const { fromWallet, fromRate, currencyPair } = walletPair
    const { multiplier } = fromWallet.currencyInfo.denominations[0]
    const bigMultiplier = Big(multiplier)
    const endUsdAmount = bigMultiplier.mul(END_USD_AMOUNT).mul(fromRate)
    const dataFetch = binaryFetchSwapQuote(swapQuoteParams, { disabled })

    try {
      const minNative = await binarySearch(
        dataFetch,
        START_USD_AMOUNT,
        endUsdAmount.toFixed(0)
      )
      minAmounts[currencyPair] = Big(minNative)
        .div(bigMultiplier)
        .toFixed(PRECISION)
    } catch (e) {
      console.log(e)
    }
  })

  await Promise.all(minAmountsPromises)

  return minAmounts
}
