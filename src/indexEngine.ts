import { setupEngine } from './utils/setupEngine'

async function main(): Promise<void> {
  const currencyWallets = await setupEngine()

  console.log('currencyWallets: ', currencyWallets)
}

main().catch(e => console.error(e))
