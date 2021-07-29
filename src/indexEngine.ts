import { setupEngine } from './utils/setupEngine'
import { swapQuotes } from './utils/swapMinAmounts'

async function main(): Promise<void> {
  const { account, currencyWallets } = await setupEngine()
  const quotes = await swapQuotes(account, currencyWallets)

  console.log('quotes: ', quotes)
}

main().catch(e => console.error(e))
