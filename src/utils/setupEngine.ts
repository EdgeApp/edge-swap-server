import {
  addEdgeCorePlugins,
  EdgeCurrencyWallet,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import bitcoinPlugins from 'edge-currency-bitcoin'
import edgeSwapPlugins from 'edge-exchange-plugins'

import { config } from './config'

addEdgeCorePlugins(bitcoinPlugins)
addEdgeCorePlugins(edgeSwapPlugins)
lockEdgeCorePlugins()

export async function setupEngine(): Promise<EdgeCurrencyWallet[]> {
  const context = await makeEdgeContext({
    apiKey: config.apiKey,
    appId: config.appId,
    plugins: config.plugins
  })

  const account = await context.loginWithPassword(
    config.username,
    config.password
  )

  const currencyWalletsPromiseArr = account.activeWalletIds.map(
    async walletId => {
      return await account.waitForCurrencyWallet(walletId)
    }
  )

  return await Promise.all(currencyWalletsPromiseArr)
}
