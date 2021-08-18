import {
  addEdgeCorePlugins,
  EdgeAccount,
  EdgeCurrencyWallet,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import accountBasedPlugins from 'edge-currency-accountbased'
import bitcoinPlugins from 'edge-currency-bitcoin'
import edgeSwapPlugins from 'edge-exchange-plugins'

import { config } from './config'

interface AccountInfo {
  account: EdgeAccount
  currencyWallets: EdgeCurrencyWallet[]
}

addEdgeCorePlugins(accountBasedPlugins)
addEdgeCorePlugins(bitcoinPlugins)
addEdgeCorePlugins(edgeSwapPlugins)
lockEdgeCorePlugins()

export async function setupEngine(): Promise<AccountInfo> {
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

  const currencyWallets = await Promise.all(currencyWalletsPromiseArr)

  return { account, currencyWallets }
}
