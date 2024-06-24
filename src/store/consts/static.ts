import { SwapHop } from "@/wasm/oraiswap_v3_wasm"

export const TESTNET_BTC_ADDRESS = '5FEE8ptrT6387MYHqYmyB8ChWfkEsGEDpTMDpwUh4FCYGyCi'
export const TESTNET_ETH_ADDRESS = '5FmDoQPFS5qPMkSumdvVVekiTpsKVmL9E5DHxHEUXCdHFdYy'
export const TESTNET_USDC_ADDRESS = '5EjKBBJMLE9R2HsXKJRw2CCMZW2q48Ps5bVAQqzsxyhH9jU5'

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
  // BTC: TESTNET_BTC_ADDRESS,
  // ETH: TESTNET_ETH_ADDRESS,
  // USDC: TESTNET_USDC_ADDRESS,
  USDT: 'orai13r0p78qtakcxu7yckfs7vr2mswe5qghv6t6t57ff4drqeqw44v5q9zrhq0',
  USDC: 'orai176zyt4mmwtncuuc63ahsfu5v8xymcuxxa8w258yrtrad7l4wqktsajtdg0',
  BTC: 'orai1tgcfr9hffjcjdpgc2354k4ut2s0fufmpva2aapsdswccp3ka442spg9efy',
  OCH: 'orai184daw0zxx4vjkjhcgc2e9q787x67qlgfk0ehg6ea6wrl6grlrztsjuydnc',
  // DEFI3: 'orai1rsx2fr97wnunevl7n09tzlvrau5u5875jq36mjx04e53mdyxnrwq9n90kh',
  // DEFI4: 'orai1gfru0p5n0w4hl0sc7gj8dsaud7zerv8wdu9e4jdh77ghydhahv2q0ecxj7',
  // DEFI5: 'orai1etr7495tul34lvrjk4zxzlnpltf5383sp497prm97pwjmwzhs73sc2umfp',
  // DEFI6: 'orai1a7fdtl4vpylkt4l2vyweaadl687g9s9jjxzz5panlx075kq96k8sfpwjhz',
  ORAI: 'orai'
  // USDT: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh'
};

export const allowTokenSymbol = Object.keys(FaucetTokenList);
export const BTC: Token = {
  symbol: 'BTC',
  address: 'orai1tgcfr9hffjcjdpgc2354k4ut2s0fufmpva2aapsdswccp3ka442spg9efy',
  decimals: 6,
  name: 'BTC',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
  coingeckoId: 'bitcoin'
};
export const OCH: Token = {
  symbol: 'OCH',
  address: 'orai184daw0zxx4vjkjhcgc2e9q787x67qlgfk0ehg6ea6wrl6grlrztsjuydnc',
  decimals: 6,
  name: 'OCH',
  logoURI:
    'https://assets.coingecko.com/coins/images/34236/standard/orchai_logo_white_copy_4x-8_%281%29.png?1704307670',
  coingeckoId: 'och'
};
// export const DEFI3: Token = {
//   symbol: 'DEFI3',
//   address: 'orai1rsx2fr97wnunevl7n09tzlvrau5u5875jq36mjx04e53mdyxnrwq9n90kh',
//   decimals: 6,
//   name: 'DEFI3',
//   logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
//   coingeckoId: 'tether'
// }
// export const DEFI4: Token = {
//   symbol: 'DEFI4',
//   address: 'orai1gfru0p5n0w4hl0sc7gj8dsaud7zerv8wdu9e4jdh77ghydhahv2q0ecxj7',
//   decimals: 6,
//   name: 'DEFI4',
//   logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
//   coingeckoId: 'tether'
// }
// export const DEFI5: Token = {
//   symbol: 'DEFI5',
//   address: 'orai1etr7495tul34lvrjk4zxzlnpltf5383sp497prm97pwjmwzhs73sc2umfp',
//   decimals: 6,
//   name: 'DEFI5',
//   logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
//   coingeckoId: 'tether'
// }
// export const DEFI6: Token = {
//   symbol: 'DEFI6',
//   address: 'orai1a7fdtl4vpylkt4l2vyweaadl687g9s9jjxzz5panlx075kq96k8sfpwjhz',
//   decimals: 6,
//   name: 'DEFI6',
//   logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
//   coingeckoId: 'tether'
// }

export const USDT: Token = {
  symbol: 'USDT',
  address: 'orai13r0p78qtakcxu7yckfs7vr2mswe5qghv6t6t57ff4drqeqw44v5q9zrhq0',
  decimals: 6,
  name: 'USDT',
  logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  coingeckoId: 'tether'
};
export const USDC: Token = {
  symbol: 'USDC',
  address: 'orai176zyt4mmwtncuuc63ahsfu5v8xymcuxxa8w258yrtrad7l4wqktsajtdg0',
  decimals: 6,
  name: 'USDC',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  coingeckoId: 'usd-coin'
};

// export const BTC: Token = {
//   symbol: 'BTC',
//   address: TESTNET_BTC_ADDRESS,
//   decimals: 8,
//   name: 'Bitcoin',
//   logoURI:
//     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
//   coingeckoId: 'bitcoin'
// }

export const ETH: Token = {
  symbol: 'ETH',
  address: TESTNET_ETH_ADDRESS,
  decimals: 18,
  name: 'Ether',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png',
  coingeckoId: 'ethereum'
};

// export const USDC: Token = {
//   symbol: 'USDC',
//   address: TESTNET_USDC_ADDRESS,
//   decimals: 6,
//   name: 'USDC',
//   logoURI:
//     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
//   coingeckoId: 'usdc'
// }

export const ORAI: Token = {
  symbol: 'ORAI',
  address: 'orai',
  decimals: 6,
  name: 'Oraichain Native Token',
  logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
  coingeckoId: 'oraichain-token'
};

// export const USDT: Token = {
//   symbol: 'USDT',
//   address: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
//   decimals: 6,
//   name: 'Tether USD',
//   logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
//   coingeckoId: 'tether'
// }

export const FAUCET_LIST_TOKEN = [USDT, USDC, OCH, BTC, ORAI];

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


export const REFRESHER_INTERVAL = 20

// key: PoolKey syntax: {tokenX}_{tokenY}_{feeTier}_{tickSpacing}, value is SwapHop[]
export const SWAP_HOPS_CACHE: Record<string, SwapHop[]> = {
  'orai-orai13r0p78qtakcxu7yckfs7vr2mswe5qghv6t6t57ff4drqeqw44v5q9zrhq0-0-0': [
    {
      pool_key: {
        token_x: 'orai',
        token_y: 'orai176zyt4mmwtncuuc63ahsfu5v8xymcuxxa8w258yrtrad7l4wqktsajtdg0',
        fee_tier: {
          fee: 100000000,
          tick_spacing: 100,
        },
      },
      x_to_y: true
    },
    {
      pool_key: {
        token_x: 'orai13r0p78qtakcxu7yckfs7vr2mswe5qghv6t6t57ff4drqeqw44v5q9zrhq0',
        token_y: 'orai176zyt4mmwtncuuc63ahsfu5v8xymcuxxa8w258yrtrad7l4wqktsajtdg0',
        fee_tier: {
          fee: 100000000,
          tick_spacing: 100,
        },
      },
      x_to_y: false
    }
  ]
}
