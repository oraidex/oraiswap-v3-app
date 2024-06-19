import type { Keplr } from '@keplr-wallet/types'

declare global {
  interface Window {
    keplr: Keplr
  }

  type Network = 'Local' | 'Testnet' | 'Mainnet'
}
