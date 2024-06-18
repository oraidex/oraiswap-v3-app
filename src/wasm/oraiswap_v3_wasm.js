let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
* @param {SqrtPrice} current_sqrt_price
* @param {SqrtPrice} target_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} by_amount_in
* @param {Percentage} fee
* @returns {SwapResult}
*/
export function compute_swap_step(current_sqrt_price, target_sqrt_price, liquidity, amount, by_amount_in, fee) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.compute_swap_step(retptr, addHeapObject(current_sqrt_price), addHeapObject(target_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), by_amount_in, addHeapObject(fee));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function get_delta_x(sqrt_price_a, sqrt_price_b, liquidity, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_delta_x(retptr, addHeapObject(sqrt_price_a), addHeapObject(sqrt_price_b), addHeapObject(liquidity), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function get_delta_y(sqrt_price_a, sqrt_price_b, liquidity, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_delta_y(retptr, addHeapObject(sqrt_price_a), addHeapObject(sqrt_price_b), addHeapObject(liquidity), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_from_input(starting_sqrt_price, liquidity, amount, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_next_sqrt_price_from_input(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_from_output(starting_sqrt_price, liquidity, amount, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_next_sqrt_price_from_output(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} x
* @param {boolean} add_x
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_x_up(starting_sqrt_price, liquidity, x, add_x) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_next_sqrt_price_x_up(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(x), add_x);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} y
* @param {boolean} add_y
* @returns {SqrtPrice}
*/
export function get_next_sqrt_price_y_down(starting_sqrt_price, liquidity, y, add_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_next_sqrt_price_y_down(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(y), add_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} current_tick_index
* @param {SqrtPrice} current_sqrt_price
* @param {Liquidity} liquidity_delta
* @param {boolean} liquidity_sign
* @param {number} upper_tick
* @param {number} lower_tick
* @returns {AmountDeltaResult}
*/
export function calculate_amount_delta(current_tick_index, current_sqrt_price, liquidity_delta, liquidity_sign, upper_tick, lower_tick) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculate_amount_delta(retptr, current_tick_index, addHeapObject(current_sqrt_price), addHeapObject(liquidity_delta), liquidity_sign, upper_tick, lower_tick);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} amount
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {Percentage} fee
* @param {boolean} by_amount_in
* @param {boolean} x_to_y
* @returns {boolean}
*/
export function is_enough_amount_to_change_price(amount, starting_sqrt_price, liquidity, fee, by_amount_in, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.is_enough_amount_to_change_price(retptr, addHeapObject(amount), addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(fee), by_amount_in, x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_spacing
* @returns {Liquidity}
*/
export function calculate_max_liquidity_per_tick(tick_spacing) {
    const ret = wasm.calculate_max_liquidity_per_tick(tick_spacing);
    return takeObject(ret);
}

/**
* @param {number} tick_lower
* @param {number} tick_upper
* @param {number} tick_spacing
*/
export function check_ticks(tick_lower, tick_upper, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.check_ticks(retptr, tick_lower, tick_upper, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_index
* @param {number} tick_spacing
*/
export function check_tick(tick_index, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.check_tick(retptr, tick_index, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} expected_amount_out
* @param {Percentage} slippage
* @returns {TokenAmount}
*/
export function calculate_min_amount_out(expected_amount_out, slippage) {
    const ret = wasm.calculate_min_amount_out(addHeapObject(expected_amount_out), addHeapObject(slippage));
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_global_max_sqrt_price() {
    const ret = wasm.get_global_max_sqrt_price();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_global_min_sqrt_price() {
    const ret = wasm.get_global_min_sqrt_price();
    return takeObject(ret);
}

/**
* @returns {number}
*/
export function get_tick_search_range() {
    const ret = wasm.get_tick_search_range();
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_max_chunk(tick_spacing) {
    const ret = wasm.get_max_chunk(tick_spacing);
    return ret;
}

/**
* @returns {number}
*/
export function get_chunk_size() {
    const ret = wasm.get_chunk_size();
    return ret;
}

/**
* @returns {number}
*/
export function get_max_tick_cross() {
    const ret = wasm.get_max_tick_cross();
    return ret;
}

/**
* @returns {number}
*/
export function get_max_tickmap_query_size() {
    const ret = wasm.get_max_tickmap_query_size();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_liquidity_ticks_limit() {
    const ret = wasm.get_liquidity_ticks_limit();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_max_pool_keys_returned() {
    const ret = wasm.get_max_pool_keys_returned();
    return ret;
}

/**
* @returns {number}
*/
export function get_max_pool_pairs_returned() {
    const ret = wasm.get_max_pool_pairs_returned();
    return ret >>> 0;
}

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
export function calculate_fee(lower_tick_index, lower_tick_fee_growth_outside_x, lower_tick_fee_growth_outside_y, upper_tick_index, upper_tick_fee_growth_outside_x, upper_tick_fee_growth_outside_y, pool_current_tick_index, pool_fee_growth_global_x, pool_fee_growth_global_y, position_fee_growth_inside_x, position_fee_growth_inside_y, position_liquidity) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculate_fee(retptr, lower_tick_index, addHeapObject(lower_tick_fee_growth_outside_x), addHeapObject(lower_tick_fee_growth_outside_y), upper_tick_index, addHeapObject(upper_tick_fee_growth_outside_x), addHeapObject(upper_tick_fee_growth_outside_y), pool_current_tick_index, addHeapObject(pool_fee_growth_global_x), addHeapObject(pool_fee_growth_global_y), addHeapObject(position_fee_growth_inside_x), addHeapObject(position_fee_growth_inside_y), addHeapObject(position_liquidity));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} token_candidate
* @param {string} token_to_compare
* @returns {boolean}
*/
export function is_token_x(token_candidate, token_to_compare) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(token_candidate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(token_to_compare, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.is_token_x(retptr, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_index
* @param {number} tick_spacing
* @param {SqrtPrice} sqrt_price
* @returns {boolean}
*/
export function check_tick_to_sqrt_price_relationship(tick_index, tick_spacing, sqrt_price) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.check_tick_to_sqrt_price_relationship(retptr, tick_index, tick_spacing, addHeapObject(sqrt_price));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} accurate_tick
* @param {number} tick_spacing
* @returns {number}
*/
export function align_tick_to_spacing(accurate_tick, tick_spacing) {
    const ret = wasm.align_tick_to_spacing(accurate_tick, tick_spacing);
    return ret;
}

/**
* @param {SqrtPrice} sqrt_price
* @param {number} tick_spacing
* @returns {number}
*/
export function get_tick_at_sqrt_price(sqrt_price, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_tick_at_sqrt_price(retptr, addHeapObject(sqrt_price), tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} x
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function get_liquidity_by_x(x, lower_tick, upper_tick, current_sqrt_price, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_liquidity_by_x(retptr, addHeapObject(x), lower_tick, upper_tick, addHeapObject(current_sqrt_price), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} y
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function get_liquidity_by_y(y, lower_tick, upper_tick, current_sqrt_price, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_liquidity_by_y(retptr, addHeapObject(y), lower_tick, upper_tick, addHeapObject(current_sqrt_price), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {Percentage} fee
* @param {number} tick_spacing
* @returns {FeeTier}
*/
export function new_fee_tier(fee, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.new_fee_tier(retptr, addHeapObject(fee), tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} token_0
* @param {string} token_1
* @param {FeeTier} fee_tier
* @returns {PoolKey}
*/
export function new_pool_key(token_0, token_1, fee_tier) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(token_0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(token_1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.new_pool_key(retptr, ptr0, len0, ptr1, len1, addHeapObject(fee_tier));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_fee_growth_scale() {
    const ret = wasm.get_fee_growth_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_fee_growth_denominator() {
    const ret = wasm.get_fee_growth_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_fee_growth(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_fee_growth(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_fixed_point_scale() {
    const ret = wasm.get_fixed_point_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_fixed_point_denominator() {
    const ret = wasm.get_fixed_point_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_fixed_point(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_fixed_point(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_liquidity_scale() {
    const ret = wasm.get_liquidity_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_liquidity_denominator() {
    const ret = wasm.get_liquidity_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_liquidity(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_liquidity(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_percentage_scale() {
    const ret = wasm.get_fixed_point_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_percentage_denominator() {
    const ret = wasm.get_percentage_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_percentage(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_percentage(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_price_scale() {
    const ret = wasm.get_price_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_price_denominator() {
    const ret = wasm.get_price_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_price(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_price(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_seconds_per_liquidity_scale() {
    const ret = wasm.get_price_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_seconds_per_liquidity_denominator() {
    const ret = wasm.get_price_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_seconds_per_liquidity(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_seconds_per_liquidity(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function get_sqrt_price_scale() {
    const ret = wasm.get_price_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_sqrt_price_denominator() {
    const ret = wasm.get_price_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_sqrt_price(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_sqrt_price(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_index
* @returns {SqrtPrice}
*/
export function calculate_sqrt_price(tick_index) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculate_sqrt_price(retptr, tick_index);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_max_tick(tick_spacing) {
    const ret = wasm.get_max_tick(tick_spacing);
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function get_min_tick(tick_spacing) {
    const ret = wasm.get_min_tick(tick_spacing);
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function get_max_sqrt_price(tick_spacing) {
    const ret = wasm.get_max_sqrt_price(tick_spacing);
    return takeObject(ret);
}

/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function get_min_sqrt_price(tick_spacing) {
    const ret = wasm.get_min_sqrt_price(tick_spacing);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_token_amount_scale() {
    const ret = wasm.get_token_amount_scale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function get_token_amount_denominator() {
    const ret = wasm.get_token_amount_denominator();
    return takeObject(ret);
}

/**
* @param {number} js_val
* @param {number} scale
* @returns {bigint}
*/
export function to_token_amount(js_val, scale) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_token_amount(retptr, js_val, scale);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

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
export function simulate_swap(tickmap, fee_tier, pool, ticks, x_to_y, amount, by_amount_in, sqrt_price_limit) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.simulate_swap(retptr, addHeapObject(tickmap), addHeapObject(fee_tier), addHeapObject(pool), addHeapObject(ticks), x_to_y, addHeapObject(amount), by_amount_in, addHeapObject(sqrt_price_limit));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick
* @param {number} tick_spacing
* @returns {PositionResult}
*/
export function tick_to_position_js(tick, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tick_to_position_js(retptr, tick, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} chunk
* @param {number} bit
* @param {number} tick_spacing
* @returns {number}
*/
export function position_to_tick(chunk, bit, tick_spacing) {
    const ret = wasm.position_to_tick(chunk, bit, tick_spacing);
    return ret;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export const SwapError = Object.freeze({ NotAdmin:0,"0":"NotAdmin",NotFeeReceiver:1,"1":"NotFeeReceiver",PoolAlreadyExist:2,"2":"PoolAlreadyExist",PoolNotFound:3,"3":"PoolNotFound",TickAlreadyExist:4,"4":"TickAlreadyExist",InvalidTickIndexOrTickSpacing:5,"5":"InvalidTickIndexOrTickSpacing",PositionNotFound:6,"6":"PositionNotFound",TickNotFound:7,"7":"TickNotFound",FeeTierNotFound:8,"8":"FeeTierNotFound",PoolKeyNotFound:9,"9":"PoolKeyNotFound",AmountIsZero:10,"10":"AmountIsZero",WrongLimit:11,"11":"WrongLimit",PriceLimitReached:12,"12":"PriceLimitReached",NoGainSwap:13,"13":"NoGainSwap",InvalidTickSpacing:14,"14":"InvalidTickSpacing",FeeTierAlreadyExist:15,"15":"FeeTierAlreadyExist",PoolKeyAlreadyExist:16,"16":"PoolKeyAlreadyExist",UnauthorizedFeeReceiver:17,"17":"UnauthorizedFeeReceiver",ZeroLiquidity:18,"18":"ZeroLiquidity",TransferError:19,"19":"TransferError",TokensAreSame:20,"20":"TokensAreSame",AmountUnderMinimumAmountOut:21,"21":"AmountUnderMinimumAmountOut",InvalidFee:22,"22":"InvalidFee",NotEmptyTickDeinitialization:23,"23":"NotEmptyTickDeinitialization",InvalidInitTick:24,"24":"InvalidInitTick",InvalidInitSqrtPrice:25,"25":"InvalidInitSqrtPrice",TickLimitReached:26,"26":"TickLimitReached",NoRouteFound:27,"27":"NoRouteFound",MaxTicksCrossed:28,"28":"MaxTicksCrossed",StateOutdated:29,"29":"StateOutdated",InsufficientLiquidity:30,"30":"InsufficientLiquidity", });

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_shr = function(arg0, arg1) {
        const ret = getObject(arg0) >> getObject(arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getwithrefkey_edc2c8960f0f1191 = function(arg0, arg1) {
        const ret = getObject(arg0)[getObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_String_88810dfeb4021902 = function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getwithrefkey_5e6d9547403deab8 = function(arg0, arg1) {
        const ret = getObject(arg0)[getObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_841ac57cff3d672b = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_get_bd8e338fbd5f5cc8 = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_cd7af8117672b8b8 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_BigInt_42b692c18e1ac6d6 = function(arg0) {
        const ret = BigInt(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_next_40fc327bfc8770e6 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_196c84450b364254 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_done_298b57d23c0fc80c = function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_value_d93c65011f51a456 = function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_2cee6dadfd956dfa = function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_72fb9a18b5ae2624 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_d4638f722068f043 = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_isArray_2ab64d95e09ea0ae = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2 = function(arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_entries_95cc2c823b285a09 = function(arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('oraiswap_v3_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
