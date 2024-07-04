import { SwapHop } from '@/wasm/oraiswap_v3_wasm';
import OraiIcon from '@static/svg/orai.svg';
import OraiXIcon from '@static/svg/oraix.svg';

export const TESTNET_BTC_ADDRESS = '5FEE8ptrT6387MYHqYmyB8ChWfkEsGEDpTMDpwUh4FCYGyCi';
export const TESTNET_ETH_ADDRESS = '5FmDoQPFS5qPMkSumdvVVekiTpsKVmL9E5DHxHEUXCdHFdYy';
export const TESTNET_USDC_ADDRESS = '5EjKBBJMLE9R2HsXKJRw2CCMZW2q48Ps5bVAQqzsxyhH9jU5';

export enum OraichainNetworks {
  TEST = 'https://testnet.rpc.orai.io',
  MAIN = 'https://rpc.orai.io'
}

export const TESTNET_DEX_ADDRESS = '';

export const POSITIONS_PER_PAGE = 5;

export const STABLECOIN_ADDRESSES: string[] = [];

export type PositionOpeningMethod = 'range' | 'concentration';

export interface TokenPriceData {
  price: number;
}

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  logoURI: string;
  balance?: bigint;
  coingeckoId?: string;
  isUnknown?: boolean;
}

export const tokensPrices: Record<Network, Record<string, TokenPriceData>> = {
  ['Testnet']: { USDC_TEST: { price: 1 }, BTC_TEST: { price: 64572.0 } },
  ['Mainnet']: { USDC_TEST: { price: 1 }, BTC_TEST: { price: 64572.0 } },
  ['Local']: {}
};
export interface BestTier {
  tokenX: string;
  tokenY: string;
  bestTierIndex: number;
}

// const mainnetBestTiersCreator = () => {
//   const stableTokens = {
//     USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
//   }

//   const unstableTokens = {
//     BTC: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
//   }

//   const bestTiers: BestTier[] = []

//   for (let i = 0; i < 4; i++) {
//     const tokenX = Object.values(stableTokens)[i]
//     for (let j = i + 1; j < 4; j++) {
//       const tokenY = Object.values(stableTokens)[j]

//       bestTiers.push({
//         tokenX,
//         tokenY,
//         bestTierIndex: 0
//       })
//     }
//   }

//   for (let i = 0; i < 5; i++) {
//     const [symbolX, tokenX] = Object.entries(unstableTokens)[i]
//     for (let j = i + 1; j < 5; j++) {
//       const [symbolY, tokenY] = Object.entries(unstableTokens)[j]

//       if (symbolX.slice(-3) === 'SOL' && symbolY.slice(-3) === 'SOL') {
//         bestTiers.push({
//           tokenX,
//           tokenY,
//           bestTierIndex: 0
//         })
//       } else {
//         bestTiers.push({
//           tokenX,
//           tokenY,
//           bestTierIndex: 2
//         })
//       }
//     }
//   }

//   for (let i = 0; i < 4; i++) {
//     const tokenX = Object.values(stableTokens)[i]
//     for (let j = 0; j < 5; j++) {
//       const tokenY = Object.values(unstableTokens)[j]

//       bestTiers.push({
//         tokenX,
//         tokenY,
//         bestTierIndex: 2
//       })
//     }
//   }

//   return bestTiers
// }

export const bestTiers: Record<Network, BestTier[]> = {
  //TODO add best Tiers
  ['Testnet']: [],
  ['Mainnet']: [],
  ['Local']: []
};

export const commonTokensForNetworks: Record<Network, string[]> = {
  ['Testnet']: [],
  ['Mainnet']: [],
  ['Local']: []
};

export const FAUCET_DEPLOYER_MNEMONIC =
  'motion ice subject actress spider rare leg fortune brown similar excess amazing';

export const FAUCET_TOKEN_AMOUNT = 1000n;

export const TokenAirdropAmount = {
  BTC: 100000n,
  ETH: 20000000000000000n,
  USDC: 50000000n
};

export const FaucetTokenList = {
  ORAI: 'orai',
  ORAIX: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
  OCH: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
  USDT: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  USDC: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd'
};

export const allowTokenSymbol = Object.keys(FaucetTokenList);

export const OCH: Token = {
  symbol: 'OCH',
  address: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
  decimals: 6,
  name: 'Orchai Token',
  logoURI:
    'https://assets.coingecko.com/coins/images/34236/standard/orchai_logo_white_copy_4x-8_%281%29.png?1704307670',
  coingeckoId: 'och'
};

export const USDT: Token = {
  symbol: 'USDT',
  address: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  decimals: 6,
  name: 'USDC',
  logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  coingeckoId: 'tether'
};

export const USDC: Token = {
  symbol: 'USDC',
  address: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
  decimals: 6,
  name: 'USDC',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  coingeckoId: 'usd-coin'
};

export const ORAI: Token = {
  symbol: 'ORAI',
  address: 'orai',
  decimals: 6,
  name: 'Orai Token',
  // logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
  logoURI: OraiIcon,
  coingeckoId: 'oraichain-token'
};

export const ORAIX: Token = {
  symbol: 'ORAIX',
  address: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
  decimals: 6,
  name: 'ORAIX',
  // logoURI: 'https://i.ibb.co/VmMJtf7/oraix.png',
  logoURI: OraiXIcon,
  coingeckoId: 'oraidex'
};

export const FAUCET_LIST_TOKEN = [ORAIX, USDT, USDC, OCH, ORAI];

export const DEFAULT_INVARIANT_OPTIONS = {
  storageDepositLimit: null,
  refTime: 100000000000,
  proofSize: 100000000000
};

export const DEFAULT_PSP22_OPTIONS = {
  storageDepositLimit: null,
  refTime: 5000000000,
  proofSize: 5000000000
};

export const DEFAULT_WAZERO_OPTIONS = {
  storageDepositLimit: null,
  refTime: 5000000000,
  proofSize: 5000000000
};

export const INVARIANT_SWAP_OPTIONS = {
  storageDepositLimit: null,
  refTime: 250000000000,
  proofSize: 500000
};

export const INVARIANT_WITHDRAW_ALL_WAZERO = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 250000
};

export const INVARIANT_CREATE_POOL_OPTIONS = {
  storageDepositLimit: null,
  refTime: 10000000000,
  proofSize: 250000
};

export const INVARIANT_CREATE_POSITION_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 500000
};

export const INVARIANT_CLAIM_FEE_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 500000
};

export const INVARIANT_REMOVE_POSITION_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 250000
};

export const PSP22_APPROVE_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
};

export const WAZERO_DEPOSIT_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
};

export const WAZERO_WITHDRAW_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
};

// export const ALL_FEE_TIERS_DATA = FEE_TIERS.map((tier, index) => ({
//   tier,
//   primaryIndex: index
// }))

export const U128MAX = 2n ** 128n - 1n;

export const SWAP_SAFE_TRANSACTION_FEE = BigInt(Math.ceil(0.05 * 10 ** 12));
export const POOL_SAFE_TRANSACTION_FEE = BigInt(Math.ceil(0.05 * 10 ** 12));

export const REFRESHER_INTERVAL = 20;

/**
 * export const FaucetTokenList = {
  ORAI: 'orai',
  ORAIX: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
  OCH: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
  USDT: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  USDC: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd'
};
 */

// key: PoolKey syntax: {tokenX}_{tokenY}_{feeTier}_{tickSpacing}, value is SwapHop[]
export const SWAP_HOPS_CACHE: Record<string, SwapHop[]> = {
  'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-0-0': [
    {
      pool_key: {
        token_x: 'orai',
        token_y: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    }
  ],
  'orai-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-0-0': [
    {
      pool_key: {
        token_x: 'orai',
        token_y: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    }
  ],
  'orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-0-0': [
    {
      pool_key: {
        token_x: 'orai',
        token_y: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
        fee_tier: {
          fee: 500000000,
          tick_spacing: 10
        }
      },
      x_to_y: true
    }
  ],
  'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-0-0': [
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: false
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: true
    }
  ],
  'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-0-0': [
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: false
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
        fee_tier: {
          fee: 500000000,
          tick_spacing: 10
        }
      },
      x_to_y: true
    }
  ],
  'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-0-0': [
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q',
        fee_tier: {
          fee: 3000000000,
          tick_spacing: 100
        }
      },
      x_to_y: false
    },
    {
      pool_key: {
        token_x: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
        token_y: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
        fee_tier: {
          fee: 500000000,
          tick_spacing: 10
        }
      },
      x_to_y: true
    }
  ],
};
