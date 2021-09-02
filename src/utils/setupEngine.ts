import {
  addEdgeCorePlugins,
  EdgeAccount,
  EdgeCurrencyWallet,
  EdgePluginMap,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import accountBasedPlugins from 'edge-currency-accountbased'
import bitcoinPlugins from 'edge-currency-bitcoin'
import edgeSwapPlugins from 'edge-exchange-plugins'

import { config } from './config'

interface AccountInfo {
  account: EdgeAccount
  wallets: EdgeCurrencyWallet[]
  plugins: EdgePluginMap<true>
  pairs: Array<{ currency_pair: string }>
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
  // Login into the account
  const account = await context.loginWithPassword(
    config.username,
    config.password
  )
  // Wait for all the currency wallets to load
  const currencyWalletsPromiseArr = account.activeWalletIds.map(
    async walletId => await account.waitForCurrencyWallet(walletId)
  )
  const wallets = await Promise.all(currencyWalletsPromiseArr)
  // Enable all swap plugins
  const enablePluginPromises = Object.values(account.swapConfig).map(
    async plugin => await plugin.changeEnabled(true)
  )
  await Promise.all(enablePluginPromises)
  // Create a map with all the plugins with values set to true
  const plugins = Object.keys(account.swapConfig).reduce(
    (map, pluginName) => ({ ...map, [pluginName]: true }),
    {}
  )
  // Prefixed Currency Pair array for the Rate server request
  const pairs = wallets.map(wallet => ({
    currency_pair: `${config.currencyPairPrefix}${wallet.currencyInfo.currencyCode}`
  }))
  return { account, wallets, plugins, pairs }
}
