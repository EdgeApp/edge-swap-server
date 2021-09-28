import nano from 'nano'
import promisify from 'promisify-node'

import { config } from './utils/config'
import { fetchExchangeRates } from './utils/exchangeRate.old'
import { setupEngine } from './utils/setupEngine'
import {
  createBinarySwapQuote,
  createCurrencyPairs,
  swapMinAmounts
} from './utils/swapMinAmounts'
import { snooze } from './utils/utils'

const ONE_HOUR_IN_MS = 1000 * 60 * 60 // Delay an hour between checks
const ONE_DAY = ONE_HOUR_IN_MS * 24
// =============================================================================
// Nano for CouchDB
// =============================================================================
const nanoDb = nano(config.dbFullpath)
const dbSwap = nanoDb.db.use(config.dbName)
promisify(dbSwap)

async function main(): Promise<void> {
  while (true) {
    const { pairs, wallets, plugins, account } = await setupEngine()
    const swapQuote = createBinarySwapQuote(account)
    // Fetch exchange rates for wallets
    const exchangeRates = await fetchExchangeRates(pairs)
    // Create All the possible wallet pairs we have with the correct exchange rates
    const walletPairs = createCurrencyPairs(wallets, exchangeRates)

    const swapPluginPromises = Object.keys(plugins).map(async pluginName => {
      try {
        const pluginInfoDoc = await dbSwap.get(pluginName)
        // Get the swap min amount for all currency pairs
        const newMinAmounts = await swapMinAmounts(
          pluginName,
          plugins,
          walletPairs,
          swapQuote
        )
        const data = { ...(pluginInfoDoc.data ?? {}), ...newMinAmounts }
        await dbSwap.insert({ ...pluginInfoDoc, data }, pluginName)
      } catch (e) {
        console.log(e)
      }
    })

    try {
      await Promise.all(swapPluginPromises)
    } catch (e) {
      console.log(e)
    } finally {
      await snooze(ONE_DAY)
    }
  }
}

main().catch(e => console.error(e))
