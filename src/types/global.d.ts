import type { Keplr } from '@keplr-wallet/types';

declare global {
  interface Window {
    keplr: Keplr;
    owallet?: Keplr;
    Keplr?: any;
    walletType?: string;
    oraiAddr?: string;
  }

  type Network = 'Local' | 'Testnet' | 'Mainnet';
}
