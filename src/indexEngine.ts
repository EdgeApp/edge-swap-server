import { formatISO } from 'date-fns'

import { config } from './utils/config'
import { minAmtDbPrefix } from './utils/couchSchema'
import { getLowercaseSwapPlugins } from './utils/lowercaseSwapPlugins'
import { setupEngine } from './utils/setupEngine'
import { swapMinAmounts } from './utils/swapMinAmounts'

const nano = require('nano')
const promisify = require('promisify-node')

const swapPluginNamesArr = getLowercaseSwapPlugins(config.plugins)

// Nano for CouchDB
// =============================================================================
const nanoDb = nano(config.dbFullpath)
const minAmountDbs = swapPluginNamesArr.reduce(
  (currentMinAmtDbsObj, currentPlugin) => {
    const pluginDb = nanoDb.db.use(minAmtDbPrefix + currentPlugin)
    return { ...currentMinAmtDbsObj, [currentPlugin]: promisify(pluginDb) }
  },
  {}
)

async function main(): Promise<void> {
  const { account, currencyWallets } = await setupEngine()
  const minAmounts = await swapMinAmounts(account, currencyWallets)

  const currentUTCDate: string = formatISO(new Date(), {
    representation: 'date'
  }) // Variable for current UTC date using date-fns

  const minAmtInsertPromises = minAmounts.map(async minAmountInfo => {
    const { minAmount: minAmountNum, currencyPair, plugin } = minAmountInfo
    const pluginData = {
      _id: currentUTCDate + ':' + currencyPair,
      data: {
        minAmount: minAmountNum.toString()
      }
    }
    await minAmountDbs[plugin.toLowerCase()].insert(pluginData)
  })

  try {
    await Promise.all(minAmtInsertPromises)
  } catch (e) {
    console.log(e)
  }
}

main().catch(e => console.error(e))
