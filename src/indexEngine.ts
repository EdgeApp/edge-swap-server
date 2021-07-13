import { setupEngine } from './utils/setupEngine'

async function main(): Promise<void> {
  const { account, currencyWallets } = await setupEngine()

  console.log('username: ', account.username)
  console.log('currencyWallets: ', currencyWallets)
}

main().catch(e => console.error(e))
