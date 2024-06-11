import { SimulateCosmWasmClient } from '@oraichain/cw-simulate'
import { OraiswapTokenClient, OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk'
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build'
import fs from 'fs'
import path from 'path'
import { OraiswapV3Client, OraiswapV3Types } from '../sdk'

export const client = new SimulateCosmWasmClient({
  chainId: 'Oraichain',
  bech32Prefix: 'orai'
})

describe('swap', () => {
  let senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g'
  // decimals: 12 + scale 3 = e9
  let protocol_fee = 6e9
  let token: OraiswapTokenClient
  let dex: OraiswapV3Client

  beforeEach(async () => {
    // init airi token
    const res = await oraidexArtifacts.deployContract(
      client,
      senderAddress,

      {
        decimals: 6,
        symbol: 'AIRI',
        name: 'Airight token',
        initial_balances: [{ address: senderAddress, amount: '1000000000' }]
      } as OraiswapTokenTypes.InstantiateMsg,
      'token',
      'oraiswap_token'
    )
    token = new OraiswapTokenClient(client, senderAddress, res.contractAddress)

    const { codeId: dexCodeId } = await client.upload(
      senderAddress,
      fs.readFileSync(path.resolve(__dirname, 'testdata', 'oraiswap-v3.wasm')),
      'auto'
    )

    dex = new OraiswapV3Client(
      client,
      senderAddress,
      (
        await client.instantiate(
          senderAddress,
          dexCodeId,
          { protocol_fee } as OraiswapV3Types.InstantiateMsg,
          'oraiswap_v3',
          'auto'
        )
      ).contractAddress
    )
  })

  it('test_swap_x_to_y', async () => {
    let feeTier: OraiswapV3Types.FeeTier = { fee: protocol_fee, tick_spacing: 10 }
    let res = await dex.addFeeTier({ feeTier })
    console.log(res)
    let init_tick = 0
    // let init_sqrt_price = calculate_sqrt_price(init_tick)
    // let initial_amount = 10u128.pow(10);
    // let (token_x, token_y) = create_tokens!(app, initial_amount, initial_amount);
    // create_pool!(
    //     app,
    //     dex,
    //     token_x,
    //     token_y,
    //     fee_tier,
    //     init_sqrt_price,
    //     init_tick,
    //     "alice"
    // )
    // .unwrap();
    // approve!(app, token_x, dex, initial_amount, "alice").unwrap();
    // approve!(app, token_y, dex, initial_amount, "alice").unwrap();
    // let pool_key = PoolKey::new(token_x.clone(), token_y.clone(), fee_tier).unwrap();
    // let lower_tick_index = -20;
    // let middle_tick_index = -10;
    // let upper_tick_index = 10;
    // let liquidity_delta = Liquidity::from_integer(1000000);
    // create_position!(
    //     app,
    //     dex,
    //     pool_key,
    //     lower_tick_index,
    //     upper_tick_index,
    //     liquidity_delta,
    //     SqrtPrice::new(0),
    //     SqrtPrice::max_instance(),
    //     "alice"
    // )
    // .unwrap();
    // create_position!(
    //     app,
    //     dex,
    //     pool_key,
    //     lower_tick_index - 20,
    //     middle_tick_index,
    //     liquidity_delta,
    //     SqrtPrice::new(0),
    //     SqrtPrice::max_instance(),
    //     "alice"
    // )
    // .unwrap();
    // let pool = get_pool!(app, dex, token_x, token_y, fee_tier).unwrap();
    // assert_eq!(pool.liquidity, liquidity_delta);
    // let amount = 1000;
    // let swap_amount = TokenAmount(amount);
    // mint!(app, token_x, "bob", amount, "alice").unwrap();
    // approve!(app, token_x, dex, amount, "bob").unwrap();
    // let slippage = SqrtPrice::new(MIN_SQRT_PRICE);
    // let target_sqrt_price = quote!(app, dex, pool_key, true, swap_amount, true, slippage)
    //     .unwrap()
    //     .target_sqrt_price;
    // let before_dex_x = balance_of!(app, token_x, dex);
    // let before_dex_y = balance_of!(app, token_y, dex);
    // swap!(
    //     app,
    //     dex,
    //     pool_key,
    //     true,
    //     swap_amount,
    //     true,
    //     target_sqrt_price,
    //     "bob"
    // )
    // .unwrap();
    // // Load states
    // let pool = get_pool!(app, dex, token_x, token_y, fee_tier).unwrap();
    // let lower_tick = get_tick!(app, dex, pool_key, lower_tick_index).unwrap();
    // let middle_tick = get_tick!(app, dex, pool_key, middle_tick_index).unwrap();
    // let upper_tick = get_tick!(app, dex, pool_key, upper_tick_index).unwrap();
    // let lower_tick_bit = is_tick_initialized!(app, dex, pool_key, lower_tick_index);
    // let middle_tick_bit = is_tick_initialized!(app, dex, pool_key, middle_tick_index);
    // let upper_tick_bit = is_tick_initialized!(app, dex, pool_key, upper_tick_index);
    // let bob_x = balance_of!(app, token_x, "bob");
    // let bob_y = balance_of!(app, token_y, "bob");
    // let dex_x = balance_of!(app, token_x, dex);
    // let dex_y = balance_of!(app, token_y, dex);
    // let delta_dex_y = before_dex_y - dex_y;
    // let delta_dex_x = dex_x - before_dex_x;
    // let expected_y = amount - 10;
    // let expected_x = 0u128;
    // // Check balances
    // assert_eq!(bob_x, expected_x);
    // assert_eq!(bob_y, expected_y);
    // assert_eq!(delta_dex_x, amount);
    // assert_eq!(delta_dex_y, expected_y);
    // // Check Pool
    // assert_eq!(pool.fee_growth_global_y, FeeGrowth::new(0));
    // assert_eq!(
    //     pool.fee_growth_global_x,
    //     FeeGrowth::new(40000000000000000000000)
    // );
    // assert_eq!(pool.fee_protocol_token_y, TokenAmount(0));
    // assert_eq!(pool.fee_protocol_token_x, TokenAmount(2));
    // // Check Ticks
    // assert_eq!(lower_tick.liquidity_change, liquidity_delta);
    // assert_eq!(middle_tick.liquidity_change, liquidity_delta);
    // assert_eq!(upper_tick.liquidity_change, liquidity_delta);
    // assert_eq!(upper_tick.fee_growth_outside_x, FeeGrowth::new(0));
    // assert_eq!(
    //     middle_tick.fee_growth_outside_x,
    //     FeeGrowth::new(30000000000000000000000)
    // );
    // assert_eq!(lower_tick.fee_growth_outside_x, FeeGrowth::new(0));
    // assert!(lower_tick_bit);
    // assert!(middle_tick_bit);
    // assert!(upper_tick_bit);
  })
})
