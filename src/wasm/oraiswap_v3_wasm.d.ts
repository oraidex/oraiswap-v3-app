/* tslint:disable */
/* eslint-disable */
/**
* @param {SqrtPrice} current_sqrt_price
* @param {SqrtPrice} target_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} by_amount_in
* @param {Percentage} fee
* @returns {SwapResult}
*/
export function compute_swap_step(current_sqrt_price: SqrtPrice, target_sqrt_price: SqrtPrice, liquidity: Liquidity, amount: TokenAmount, by_amount_in: boolean, fee: Percentage): SwapResult;
/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function get_delta_x(sqrt_price_a: SqrtPrice, sqrt_price_b: SqrtPrice, liquidity: Liquidity, rounding_up: boolean): TokenAmount;
/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function get_delta_y(sqrt_price_a: SqrtPrice, sqrt_price_b: SqrtPrice, liquidity: Liquidity, rounding_up: boolean): TokenAmount;
/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_from_input(starting_sqrt_price: SqrtPrice, liquidity: Liquidity, amount: TokenAmount, x_to_y: boolean): SqrtPrice;
/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_from_output(starting_sqrt_price: SqrtPrice, liquidity: Liquidity, amount: TokenAmount, x_to_y: boolean): SqrtPrice;
/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} x
* @param {boolean} add_x
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_x_up(starting_sqrt_price: SqrtPrice, liquidity: Liquidity, x: TokenAmount, add_x: boolean): SqrtPrice;
/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} y
* @param {boolean} add_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_y_down(starting_sqrt_price: SqrtPrice, liquidity: Liquidity, y: TokenAmount, add_y: boolean): SqrtPrice;
/**
* @param {number} current_tick_index
* @param {SqrtPrice} current_sqrt_price
* @param {Liquidity} liquidity_delta
* @param {boolean} liquidity_sign
* @param {number} upper_tick
* @param {number} lower_tick
* @returns {AmountDeltaResult}
*/
export function calculate_amount_delta(current_tick_index: number, current_sqrt_price: SqrtPrice, liquidity_delta: Liquidity, liquidity_sign: boolean, upper_tick: number, lower_tick: number): AmountDeltaResult;
/**
* @param {TokenAmount} amount
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {Percentage} fee
* @param {boolean} by_amount_in
* @param {boolean} x_to_y
* @returns {boolean}
*/
export function is_enough_amount_to_change_price(amount: TokenAmount, starting_sqrt_price: SqrtPrice, liquidity: Liquidity, fee: Percentage, by_amount_in: boolean, x_to_y: boolean): boolean;
/**
* @param {number} tick_spacing
* @returns {Liquidity}
*/
export function calculate_max_liquidity_per_tick(tick_spacing: number): Liquidity;
/**
* @param {number} tick_lower
* @param {number} tick_upper
* @param {number} tick_spacing
*/
export function check_ticks(tick_lower: number, tick_upper: number, tick_spacing: number): void;
/**
* @param {number} tick_index
* @param {number} tick_spacing
*/
export function check_tick(tick_index: number, tick_spacing: number): void;
/**
* @param {TokenAmount} expected_amount_out
* @param {Percentage} slippage
* @returns {TokenAmount}
*/
export function calculate_min_amount_out(expected_amount_out: TokenAmount, slippage: Percentage): TokenAmount;
/**
* @returns {bigint}
*/
export function get_global_max_sqrt_price(): bigint;
/**
* @returns {bigint}
*/
export function get_global_min_sqrt_price(): bigint;
/**
* @returns {number}
*/
export function get_tick_search_range(): number;
/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_max_chunk(tick_spacing: number): number;
/**
* @returns {number}
*/
export function get_chunk_size(): number;
/**
* @returns {number}
*/
export function get_max_tick_cross(): number;
/**
* @returns {number}
*/
export function get_max_tickmap_query_size(): number;
/**
* @returns {number}
*/
export function get_liquidity_ticks_limit(): number;
/**
* @returns {number}
*/
export function get_max_pool_keys_returned(): number;
/**
* @returns {number}
*/
export function get_max_pool_pairs_returned(): number;
/**
* @param {number} lower_tick_index
* @param {FeeGrowth} lower_tick_fee_growth_outside_x
* @param {FeeGrowth} lower_tick_fee_growth_outside_y
* @param {number} upper_tick_index
* @param {FeeGrowth} upper_tick_fee_growth_outside_x
* @param {FeeGrowth} upper_tick_fee_growth_outside_y
* @param {number} pool_current_tick_index
* @param {FeeGrowth} pool_fee_growth_global_x
* @param {FeeGrowth} pool_fee_growth_global_y
* @param {FeeGrowth} position_fee_growth_inside_x
* @param {FeeGrowth} position_fee_growth_inside_y
* @param {Liquidity} position_liquidity
* @returns {TokenAmounts}
*/
export function calculate_fee(lower_tick_index: number, lower_tick_fee_growth_outside_x: FeeGrowth, lower_tick_fee_growth_outside_y: FeeGrowth, upper_tick_index: number, upper_tick_fee_growth_outside_x: FeeGrowth, upper_tick_fee_growth_outside_y: FeeGrowth, pool_current_tick_index: number, pool_fee_growth_global_x: FeeGrowth, pool_fee_growth_global_y: FeeGrowth, position_fee_growth_inside_x: FeeGrowth, position_fee_growth_inside_y: FeeGrowth, position_liquidity: Liquidity): TokenAmounts;
/**
* @param {string} token_candidate
* @param {string} token_to_compare
* @returns {boolean}
*/
export function is_token_x(token_candidate: string, token_to_compare: string): boolean;
/**
* @param {number} tick_index
* @param {number} tick_spacing
* @param {SqrtPrice} sqrt_price
* @returns {boolean}
*/
export function check_tick_to_sqrt_price_relationship(tick_index: number, tick_spacing: number, sqrt_price: SqrtPrice): boolean;
/**
* @param {number} accurate_tick
* @param {number} tick_spacing
* @returns {number}
*/
export function align_tick_to_spacing(accurate_tick: number, tick_spacing: number): number;
/**
* @param {SqrtPrice} sqrt_price
* @param {number} tick_spacing
* @returns {number}
*/
export function get_tick_at_sqrt_price(sqrt_price: SqrtPrice, tick_spacing: number): number;
/**
* @param {TokenAmount} x
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function get_liquidity_by_x(x: TokenAmount, lower_tick: number, upper_tick: number, current_sqrt_price: SqrtPrice, rounding_up: boolean): SingleTokenLiquidity;
/**
* @param {TokenAmount} y
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function get_liquidity_by_y(y: TokenAmount, lower_tick: number, upper_tick: number, current_sqrt_price: SqrtPrice, rounding_up: boolean): SingleTokenLiquidity;
/**
* @param {Percentage} fee
* @param {number} tick_spacing
* @returns {FeeTier}
*/
export function new_fee_tier(fee: Percentage, tick_spacing: number): FeeTier;
/**
* @param {string} token_0
* @param {string} token_1
* @param {FeeTier} fee_tier
* @returns {PoolKey}
*/
export function new_pool_key(token_0: string, token_1: string, fee_tier: FeeTier): PoolKey;
/**
* @returns {bigint}
*/
export function get_fee_growth_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_fee_growth_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_fee_growth(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_fixed_point_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_fixed_point_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_fixed_point(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_liquidity_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_liquidity_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_liquidity(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_percentage_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_percentage_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_percentage(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_price_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_price_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_price(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_seconds_per_liquidity_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_seconds_per_liquidity_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_seconds_per_liquidity(js_val: number, scale: number): bigint;
/**
* @returns {bigint}
*/
export function get_sqrt_price_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_sqrt_price_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_sqrt_price(js_val: number, scale: number): bigint;
/**
* @param {number} tick_index
* @returns {SqrtPrice}
*/
export function calculate_sqrt_price(tick_index: number): SqrtPrice;
/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_max_tick(tick_spacing: number): number;
/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_min_tick(tick_spacing: number): number;
/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function get_max_sqrt_price(tick_spacing: number): SqrtPrice;
/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function get_min_sqrt_price(tick_spacing: number): SqrtPrice;
/**
* @returns {bigint}
*/
export function get_token_amount_scale(): bigint;
/**
* @returns {bigint}
*/
export function get_token_amount_denominator(): bigint;
/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_token_amount(js_val: number, scale: number): bigint;
/**
* @param {Tickmap} tickmap
* @param {FeeTier} fee_tier
* @param {Pool} pool
* @param {any} ticks
* @param {boolean} x_to_y
* @param {TokenAmount} amount
* @param {boolean} by_amount_in
* @param {SqrtPrice} sqrt_price_limit
* @returns {CalculateSwapResult}
*/
export function simulate_swap(tickmap: Tickmap, fee_tier: FeeTier, pool: Pool, ticks: any, x_to_y: boolean, amount: TokenAmount, by_amount_in: boolean, sqrt_price_limit: SqrtPrice): CalculateSwapResult;
/**
* @param {number} tick
* @param {number} tick_spacing
* @returns {PositionResult}
*/
export function tick_to_position_js(tick: number, tick_spacing: number): PositionResult;
/**
* @param {number} chunk
* @param {number} bit
* @param {number} tick_spacing
* @returns {number}
*/
export function position_to_tick(chunk: number, bit: number, tick_spacing: number): number;
/**
*/
export enum SwapError {
  NotAdmin = 0,
  NotFeeReceiver = 1,
  PoolAlreadyExist = 2,
  PoolNotFound = 3,
  TickAlreadyExist = 4,
  InvalidTickIndexOrTickSpacing = 5,
  PositionNotFound = 6,
  TickNotFound = 7,
  FeeTierNotFound = 8,
  PoolKeyNotFound = 9,
  AmountIsZero = 10,
  WrongLimit = 11,
  PriceLimitReached = 12,
  NoGainSwap = 13,
  InvalidTickSpacing = 14,
  FeeTierAlreadyExist = 15,
  PoolKeyAlreadyExist = 16,
  UnauthorizedFeeReceiver = 17,
  ZeroLiquidity = 18,
  TransferError = 19,
  TokensAreSame = 20,
  AmountUnderMinimumAmountOut = 21,
  InvalidFee = 22,
  NotEmptyTickDeinitialization = 23,
  InvalidInitTick = 24,
  InvalidInitSqrtPrice = 25,
  TickLimitReached = 26,
  NoRouteFound = 27,
  MaxTicksCrossed = 28,
  StateOutdated = 29,
  InsufficientLiquidity = 30,
}
export interface AmountDeltaResult {
    x: TokenAmount;
    y: TokenAmount;
    update_liquidity: boolean;
}

export interface SwapResult {
    next_sqrt_price: SqrtPrice;
    amount_in: TokenAmount;
    amount_out: TokenAmount;
    fee_amount: TokenAmount;
}

export interface SwapHop {
    pool_key: PoolKey;
    x_to_y: boolean;
}

export interface QuoteResult {
    amount_in: TokenAmount;
    amount_out: TokenAmount;
    target_sqrt_price: SqrtPrice;
    ticks: Tick[];
}

export interface TokenAmounts {
    x: TokenAmount;
    y: TokenAmount;
}

export interface SingleTokenLiquidity {
    l: Liquidity;
    amount: TokenAmount;
}

export interface Config {
    admin: string;
    protocol_fee: Percentage;
}

export type SwapError = "NotAdmin" | "NotFeeReceiver" | "PoolAlreadyExist" | "PoolNotFound" | "TickAlreadyExist" | "InvalidTickIndexOrTickSpacing" | "PositionNotFound" | "TickNotFound" | "FeeTierNotFound" | "PoolKeyNotFound" | "AmountIsZero" | "WrongLimit" | "PriceLimitReached" | "NoGainSwap" | "InvalidTickSpacing" | "FeeTierAlreadyExist" | "PoolKeyAlreadyExist" | "UnauthorizedFeeReceiver" | "ZeroLiquidity" | "TransferError" | "TokensAreSame" | "AmountUnderMinimumAmountOut" | "InvalidFee" | "NotEmptyTickDeinitialization" | "InvalidInitTick" | "InvalidInitSqrtPrice" | "TickLimitReached" | "NoRouteFound" | "MaxTicksCrossed" | "StateOutdated" | "InsufficientLiquidity";

export interface FeeTier {
    fee: Percentage;
    tick_spacing: number;
}

export interface Pool {
    liquidity: Liquidity;
    sqrt_price: SqrtPrice;
    current_tick_index: number;
    fee_growth_global_x: FeeGrowth;
    fee_growth_global_y: FeeGrowth;
    fee_protocol_token_x: TokenAmount;
    fee_protocol_token_y: TokenAmount;
    start_timestamp: number;
    last_timestamp: number;
    fee_receiver: string;
}

export interface PoolKey {
    token_x: string;
    token_y: string;
    fee_tier: FeeTier;
}

export interface Position {
    pool_key: PoolKey;
    liquidity: Liquidity;
    lower_tick_index: number;
    upper_tick_index: number;
    fee_growth_inside_x: FeeGrowth;
    fee_growth_inside_y: FeeGrowth;
    last_block_number: number;
    tokens_owed_x: TokenAmount;
    tokens_owed_y: TokenAmount;
}

export interface Tick {
    index: number;
    sign: boolean;
    liquidity_change: Liquidity;
    liquidity_gross: Liquidity;
    sqrt_price: SqrtPrice;
    fee_growth_outside_x: FeeGrowth;
    fee_growth_outside_y: FeeGrowth;
    seconds_outside: number;
}

export interface PositionTick {
    index: number;
    fee_growth_outside_x: FeeGrowth;
    fee_growth_outside_y: FeeGrowth;
    seconds_outside: number;
}

export interface LiquidityTick {
    index: number;
    liquidity_change: Liquidity;
    sign: boolean;
}

export type FeeGrowth = bigint;

export type FixedPoint = bigint;

export type Liquidity = bigint;

export type Percentage = number;

export type Price = bigint;

export type SecondsPerLiquidity = bigint;

export type SqrtPrice = bigint;

export type TokenAmount = bigint;

export interface Tickmap {
    bitmap: Map<bigint,bigint>;
}

export interface PositionResult {
    chunk: number;
    bit: number;
}

export interface CalculateSwapResult {
    amount_in: TokenAmount;
    amount_out: TokenAmount;
    fee: TokenAmount;
    start_sqrt_price: SqrtPrice;
    target_sqrt_price: SqrtPrice;
    crossed_ticks: LiquidityTick[];
    global_insufficient_liquidity: boolean;
    state_outdated: boolean;
    max_ticks_crossed: boolean;
}


export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly compute_swap_step: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly get_delta_x: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_delta_y: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_next_sqrt_price_from_input: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_next_sqrt_price_from_output: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_next_sqrt_price_x_up: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_next_sqrt_price_y_down: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly calculate_amount_delta: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly is_enough_amount_to_change_price: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly calculate_max_liquidity_per_tick: (a: number) => number;
  readonly check_ticks: (a: number, b: number, c: number, d: number) => void;
  readonly check_tick: (a: number, b: number, c: number) => void;
  readonly calculate_min_amount_out: (a: number, b: number) => number;
  readonly get_global_max_sqrt_price: () => number;
  readonly get_global_min_sqrt_price: () => number;
  readonly get_tick_search_range: () => number;
  readonly get_max_chunk: (a: number) => number;
  readonly get_chunk_size: () => number;
  readonly get_max_tick_cross: () => number;
  readonly get_max_tickmap_query_size: () => number;
  readonly get_liquidity_ticks_limit: () => number;
  readonly get_max_pool_keys_returned: () => number;
  readonly get_max_pool_pairs_returned: () => number;
  readonly calculate_fee: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly is_token_x: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly check_tick_to_sqrt_price_relationship: (a: number, b: number, c: number, d: number) => void;
  readonly align_tick_to_spacing: (a: number, b: number) => number;
  readonly get_tick_at_sqrt_price: (a: number, b: number, c: number) => void;
  readonly get_liquidity_by_x: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly get_liquidity_by_y: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly new_fee_tier: (a: number, b: number, c: number) => void;
  readonly new_pool_key: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly get_fee_growth_scale: () => number;
  readonly get_fee_growth_denominator: () => number;
  readonly to_fee_growth: (a: number, b: number, c: number) => void;
  readonly get_fixed_point_scale: () => number;
  readonly get_fixed_point_denominator: () => number;
  readonly to_fixed_point: (a: number, b: number, c: number) => void;
  readonly get_liquidity_scale: () => number;
  readonly get_liquidity_denominator: () => number;
  readonly to_liquidity: (a: number, b: number, c: number) => void;
  readonly get_percentage_denominator: () => number;
  readonly to_percentage: (a: number, b: number, c: number) => void;
  readonly get_price_scale: () => number;
  readonly get_price_denominator: () => number;
  readonly to_price: (a: number, b: number, c: number) => void;
  readonly to_seconds_per_liquidity: (a: number, b: number, c: number) => void;
  readonly to_sqrt_price: (a: number, b: number, c: number) => void;
  readonly calculate_sqrt_price: (a: number, b: number) => void;
  readonly get_max_tick: (a: number) => number;
  readonly get_min_tick: (a: number) => number;
  readonly get_max_sqrt_price: (a: number) => number;
  readonly get_min_sqrt_price: (a: number) => number;
  readonly get_token_amount_scale: () => number;
  readonly get_token_amount_denominator: () => number;
  readonly to_token_amount: (a: number, b: number, c: number) => void;
  readonly simulate_swap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly tick_to_position_js: (a: number, b: number, c: number) => void;
  readonly position_to_tick: (a: number, b: number, c: number) => number;
  readonly get_seconds_per_liquidity_denominator: () => number;
  readonly get_sqrt_price_denominator: () => number;
  readonly get_percentage_scale: () => number;
  readonly get_seconds_per_liquidity_scale: () => number;
  readonly get_sqrt_price_scale: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
