import { setupEngine } from './utils/setupEngine'
import { swapMinAmounts } from './utils/swapMinAmounts'

async function main(): Promise<void> {
  const { account, currencyWallets } = await setupEngine()
  const minAmounts = await swapMinAmounts(account, currencyWallets)

  console.log('minAmounts: ', minAmounts)
}

main().catch(e => console.error(e))
