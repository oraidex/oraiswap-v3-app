let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

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

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

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

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

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

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
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
* @param {any} js_current_sqrt_price
* @param {any} js_target_sqrt_price
* @param {any} js_liquidity
* @param {any} js_amount
* @param {any} js_by_amount_in
* @param {any} js_fee
* @returns {any}
*/
module.exports.computeSwapStep = function(js_current_sqrt_price, js_target_sqrt_price, js_liquidity, js_amount, js_by_amount_in, js_fee) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.computeSwapStep(retptr, addHeapObject(js_current_sqrt_price), addHeapObject(js_target_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_amount), addHeapObject(js_by_amount_in), addHeapObject(js_fee));
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
};

/**
* @param {any} js_sqrt_price_a
* @param {any} js_sqrt_price_b
* @param {any} js_liquidity
* @param {any} js_rounding_up
* @returns {any}
*/
module.exports.getDeltaX = function(js_sqrt_price_a, js_sqrt_price_b, js_liquidity, js_rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getDeltaX(retptr, addHeapObject(js_sqrt_price_a), addHeapObject(js_sqrt_price_b), addHeapObject(js_liquidity), addHeapObject(js_rounding_up));
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
};

/**
* @param {any} js_sqrt_price_a
* @param {any} js_sqrt_price_b
* @param {any} js_liquidity
* @param {any} js_rounding_up
* @returns {any}
*/
module.exports.getDeltaY = function(js_sqrt_price_a, js_sqrt_price_b, js_liquidity, js_rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getDeltaY(retptr, addHeapObject(js_sqrt_price_a), addHeapObject(js_sqrt_price_b), addHeapObject(js_liquidity), addHeapObject(js_rounding_up));
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
};

/**
* @param {any} js_starting_sqrt_price
* @param {any} js_liquidity
* @param {any} js_amount
* @param {any} js_x_to_y
* @returns {any}
*/
module.exports.getNextSqrtPriceFromInput = function(js_starting_sqrt_price, js_liquidity, js_amount, js_x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceFromInput(retptr, addHeapObject(js_starting_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_amount), addHeapObject(js_x_to_y));
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
};

/**
* @param {any} js_starting_sqrt_price
* @param {any} js_liquidity
* @param {any} js_amount
* @param {any} js_x_to_y
* @returns {any}
*/
module.exports.getNextSqrtPriceFromOutput = function(js_starting_sqrt_price, js_liquidity, js_amount, js_x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceFromOutput(retptr, addHeapObject(js_starting_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_amount), addHeapObject(js_x_to_y));
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
};

/**
* @param {any} js_starting_sqrt_price
* @param {any} js_liquidity
* @param {any} js_x
* @param {any} js_add_x
* @returns {any}
*/
module.exports.getNextSqrtPriceXUp = function(js_starting_sqrt_price, js_liquidity, js_x, js_add_x) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceXUp(retptr, addHeapObject(js_starting_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_x), addHeapObject(js_add_x));
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
};

/**
* @param {any} js_starting_sqrt_price
* @param {any} js_liquidity
* @param {any} js_y
* @param {any} js_add_y
* @returns {any}
*/
module.exports.getNextSqrtPriceYDown = function(js_starting_sqrt_price, js_liquidity, js_y, js_add_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceYDown(retptr, addHeapObject(js_starting_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_y), addHeapObject(js_add_y));
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
};

/**
* @param {any} js_current_tick_index
* @param {any} js_current_sqrt_price
* @param {any} js_liquidity_delta
* @param {any} js_liquidity_sign
* @param {any} js_upper_tick
* @param {any} js_lower_tick
* @returns {any}
*/
module.exports.calculateAmountDelta = function(js_current_tick_index, js_current_sqrt_price, js_liquidity_delta, js_liquidity_sign, js_upper_tick, js_lower_tick) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateAmountDelta(retptr, addHeapObject(js_current_tick_index), addHeapObject(js_current_sqrt_price), addHeapObject(js_liquidity_delta), addHeapObject(js_liquidity_sign), addHeapObject(js_upper_tick), addHeapObject(js_lower_tick));
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
};

/**
* @param {any} js_amount
* @param {any} js_starting_sqrt_price
* @param {any} js_liquidity
* @param {any} js_fee
* @param {any} js_by_amount_in
* @param {any} js_x_to_y
* @returns {any}
*/
module.exports.isEnoughAmountToChangePrice = function(js_amount, js_starting_sqrt_price, js_liquidity, js_fee, js_by_amount_in, js_x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isEnoughAmountToChangePrice(retptr, addHeapObject(js_amount), addHeapObject(js_starting_sqrt_price), addHeapObject(js_liquidity), addHeapObject(js_fee), addHeapObject(js_by_amount_in), addHeapObject(js_x_to_y));
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.calculateMaxLiquidityPerTick = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateMaxLiquidityPerTick(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_tick_lower
* @param {any} js_tick_upper
* @param {any} js_tick_spacing
* @returns {any}
*/
module.exports.checkTicks = function(js_tick_lower, js_tick_upper, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.checkTicks(retptr, addHeapObject(js_tick_lower), addHeapObject(js_tick_upper), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_tick_index
* @param {any} js_tick_spacing
* @returns {any}
*/
module.exports.checkTick = function(js_tick_index, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.checkTick(retptr, addHeapObject(js_tick_index), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_expected_amount_out
* @param {any} js_slippage
* @returns {bigint}
*/
module.exports.calculateMinAmountOut = function(js_expected_amount_out, js_slippage) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateMinAmountOut(retptr, addHeapObject(js_expected_amount_out), addHeapObject(js_slippage));
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
};

/**
* @returns {bigint}
*/
module.exports.getGlobalMaxSqrtPrice = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getGlobalMaxSqrtPrice(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getGlobalMinSqrtPrice = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getGlobalMinSqrtPrice(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getTickSearchRange = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getTickSearchRange(retptr);
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.getMaxChunk = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxChunk(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @returns {bigint}
*/
module.exports.getChunkSize = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getChunkSize(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getMaxTickCross = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxTickCross(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getMaxTickmapQuerySize = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxTickmapQuerySize(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getLiquidityTicksLimit = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getLiquidityTicksLimit(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getMaxPoolKeysReturned = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxPoolKeysReturned(retptr);
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
};

/**
* @returns {bigint}
*/
module.exports.getMaxPoolPairsReturned = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxPoolPairsReturned(retptr);
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
};

/**
* @param {any} js_lower_tick_index
* @param {any} js_lower_tick_fee_growth_outside_x
* @param {any} js_lower_tick_fee_growth_outside_y
* @param {any} js_upper_tick_index
* @param {any} js_upper_tick_fee_growth_outside_x
* @param {any} js_upper_tick_fee_growth_outside_y
* @param {any} js_pool_current_tick_index
* @param {any} js_pool_fee_growth_global_x
* @param {any} js_pool_fee_growth_global_y
* @param {any} js_position_fee_growth_inside_x
* @param {any} js_position_fee_growth_inside_y
* @param {any} js_position_liquidity
* @returns {any}
*/
module.exports._calculateFee = function(js_lower_tick_index, js_lower_tick_fee_growth_outside_x, js_lower_tick_fee_growth_outside_y, js_upper_tick_index, js_upper_tick_fee_growth_outside_x, js_upper_tick_fee_growth_outside_y, js_pool_current_tick_index, js_pool_fee_growth_global_x, js_pool_fee_growth_global_y, js_position_fee_growth_inside_x, js_position_fee_growth_inside_y, js_position_liquidity) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._calculateFee(retptr, addHeapObject(js_lower_tick_index), addHeapObject(js_lower_tick_fee_growth_outside_x), addHeapObject(js_lower_tick_fee_growth_outside_y), addHeapObject(js_upper_tick_index), addHeapObject(js_upper_tick_fee_growth_outside_x), addHeapObject(js_upper_tick_fee_growth_outside_y), addHeapObject(js_pool_current_tick_index), addHeapObject(js_pool_fee_growth_global_x), addHeapObject(js_pool_fee_growth_global_y), addHeapObject(js_position_fee_growth_inside_x), addHeapObject(js_position_fee_growth_inside_y), addHeapObject(js_position_liquidity));
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
};

/**
* @param {any} js_token_candidate
* @param {any} js_token_to_compare
* @returns {any}
*/
module.exports.isTokenX = function(js_token_candidate, js_token_to_compare) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isTokenX(retptr, addHeapObject(js_token_candidate), addHeapObject(js_token_to_compare));
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
};

/**
* @param {any} js_tick_index
* @param {any} js_tick_spacing
* @param {any} js_sqrt_price
* @returns {any}
*/
module.exports.isValidTick = function(js_tick_index, js_tick_spacing, js_sqrt_price) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isValidTick(retptr, addHeapObject(js_tick_index), addHeapObject(js_tick_spacing), addHeapObject(js_sqrt_price));
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
};

/**
* @param {any} js_accurate_tick
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.alignTickToSpacing = function(js_accurate_tick, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.alignTickToSpacing(retptr, addHeapObject(js_accurate_tick), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_sqrt_price
* @param {any} js_tick_spacing
* @returns {any}
*/
module.exports.calculateTick = function(js_sqrt_price, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateTick(retptr, addHeapObject(js_sqrt_price), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_x
* @param {any} js_lower_tick
* @param {any} js_upper_tick
* @param {any} js_current_sqrt_price
* @param {any} js_rounding_up
* @returns {any}
*/
module.exports.getLiquidityByX = function(js_x, js_lower_tick, js_upper_tick, js_current_sqrt_price, js_rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getLiquidityByX(retptr, addHeapObject(js_x), addHeapObject(js_lower_tick), addHeapObject(js_upper_tick), addHeapObject(js_current_sqrt_price), addHeapObject(js_rounding_up));
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
};

/**
* @param {any} js_y
* @param {any} js_lower_tick
* @param {any} js_upper_tick
* @param {any} js_current_sqrt_price
* @param {any} js_rounding_up
* @returns {any}
*/
module.exports.getLiquidityByY = function(js_y, js_lower_tick, js_upper_tick, js_current_sqrt_price, js_rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getLiquidityByY(retptr, addHeapObject(js_y), addHeapObject(js_lower_tick), addHeapObject(js_upper_tick), addHeapObject(js_current_sqrt_price), addHeapObject(js_rounding_up));
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
};

/**
* @param {any} js_fee
* @param {any} js_tick_spacing
* @returns {any}
*/
module.exports._newFeeTier = function(js_fee, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._newFeeTier(retptr, addHeapObject(js_fee), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} token_0
* @param {any} token_1
* @param {any} fee_tier
* @returns {any}
*/
module.exports._newPoolKey = function(token_0, token_1, fee_tier) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._newPoolKey(retptr, addHeapObject(token_0), addHeapObject(token_1), addHeapObject(fee_tier));
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
};

/**
* @returns {bigint}
*/
module.exports.getFeeGrowthScale = function() {
    const ret = wasm.getFeeGrowthScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getFeeGrowthDenominator = function() {
    const ret = wasm.getFeeGrowthDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toFeeGrowth = function(js_val, js_scale) {
    const ret = wasm.toFeeGrowth(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getFixedPointScale = function() {
    const ret = wasm.getFixedPointScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getFixedPointDenominator = function() {
    const ret = wasm.getFixedPointDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toFixedPoint = function(js_val, js_scale) {
    const ret = wasm.toFixedPoint(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getLiquidityScale = function() {
    const ret = wasm.getLiquidityScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getLiquidityDenominator = function() {
    const ret = wasm.getLiquidityDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toLiquidity = function(js_val, js_scale) {
    const ret = wasm.toLiquidity(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getPercentageScale = function() {
    const ret = wasm.getFixedPointScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getPercentageDenominator = function() {
    const ret = wasm.getPercentageDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toPercentage = function(js_val, js_scale) {
    const ret = wasm.toPercentage(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getPriceScale = function() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getPriceDenominator = function() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toPrice = function(js_val, js_scale) {
    const ret = wasm.toPrice(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getSecondsPerLiquidityScale = function() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getSecondsPerLiquidityDenominator = function() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toSecondsPerLiquidity = function(js_val, js_scale) {
    const ret = wasm.toSecondsPerLiquidity(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getSqrtPriceScale = function() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getSqrtPriceDenominator = function() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toSqrtPrice = function(js_val, js_scale) {
    const ret = wasm.toSqrtPrice(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @param {any} js_tick_index
* @returns {any}
*/
module.exports.calculateSqrtPrice = function(js_tick_index) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateSqrtPrice(retptr, addHeapObject(js_tick_index));
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.getMaxTick = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxTick(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.getMinTick = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMinTick(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.getMaxSqrtPrice = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMaxSqrtPrice(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.getMinSqrtPrice = function(js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getMinSqrtPrice(retptr, addHeapObject(js_tick_spacing));
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
};

/**
* @returns {bigint}
*/
module.exports.getTokenAmountScale = function() {
    const ret = wasm.getTokenAmountScale();
    return takeObject(ret);
};

/**
* @returns {bigint}
*/
module.exports.getTokenAmountDenominator = function() {
    const ret = wasm.getTokenAmountDenominator();
    return takeObject(ret);
};

/**
* @param {any} js_val
* @param {any} js_scale
* @returns {bigint}
*/
module.exports.toTokenAmount = function(js_val, js_scale) {
    const ret = wasm.toTokenAmount(addHeapObject(js_val), addHeapObject(js_scale));
    return takeObject(ret);
};

/**
* @param {any} js_tickmap
* @param {any} js_fee_tier
* @param {any} js_pool
* @param {any} js_ticks
* @param {any} js_x_to_y
* @param {any} js_amount
* @param {any} js_by_amount_in
* @param {any} js_sqrt_price_limit
* @returns {any}
*/
module.exports.simulateSwap = function(js_tickmap, js_fee_tier, js_pool, js_ticks, js_x_to_y, js_amount, js_by_amount_in, js_sqrt_price_limit) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.simulateSwap(retptr, addHeapObject(js_tickmap), addHeapObject(js_fee_tier), addHeapObject(js_pool), addHeapObject(js_ticks), addHeapObject(js_x_to_y), addHeapObject(js_amount), addHeapObject(js_by_amount_in), addHeapObject(js_sqrt_price_limit));
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
};

/**
* @param {any} js_tick
* @param {any} js_tick_spacing
* @returns {any}
*/
module.exports.tickIndexToPosition = function(js_tick, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tickIndexToPosition(retptr, addHeapObject(js_tick), addHeapObject(js_tick_spacing));
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
};

/**
* @param {any} js_chunk
* @param {any} js_bit
* @param {any} js_tick_spacing
* @returns {bigint}
*/
module.exports.positionToTick = function(js_chunk, js_bit, js_tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.positionToTick(retptr, addHeapObject(js_chunk), addHeapObject(js_bit), addHeapObject(js_tick_spacing));
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
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
module.exports.SwapError = Object.freeze({ NotAdmin:0,"0":"NotAdmin",NotFeeReceiver:1,"1":"NotFeeReceiver",PoolAlreadyExist:2,"2":"PoolAlreadyExist",PoolNotFound:3,"3":"PoolNotFound",TickAlreadyExist:4,"4":"TickAlreadyExist",InvalidTickIndexOrTickSpacing:5,"5":"InvalidTickIndexOrTickSpacing",PositionNotFound:6,"6":"PositionNotFound",TickNotFound:7,"7":"TickNotFound",FeeTierNotFound:8,"8":"FeeTierNotFound",PoolKeyNotFound:9,"9":"PoolKeyNotFound",AmountIsZero:10,"10":"AmountIsZero",WrongLimit:11,"11":"WrongLimit",PriceLimitReached:12,"12":"PriceLimitReached",NoGainSwap:13,"13":"NoGainSwap",InvalidTickSpacing:14,"14":"InvalidTickSpacing",FeeTierAlreadyExist:15,"15":"FeeTierAlreadyExist",PoolKeyAlreadyExist:16,"16":"PoolKeyAlreadyExist",UnauthorizedFeeReceiver:17,"17":"UnauthorizedFeeReceiver",ZeroLiquidity:18,"18":"ZeroLiquidity",TransferError:19,"19":"TransferError",TokensAreSame:20,"20":"TokensAreSame",AmountUnderMinimumAmountOut:21,"21":"AmountUnderMinimumAmountOut",InvalidFee:22,"22":"InvalidFee",NotEmptyTickDeinitialization:23,"23":"NotEmptyTickDeinitialization",InvalidInitTick:24,"24":"InvalidInitTick",InvalidInitSqrtPrice:25,"25":"InvalidInitSqrtPrice",TickLimitReached:26,"26":"TickLimitReached", });

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_bigint = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'bigint';
    return ret;
};

module.exports.__wbindgen_bigint_from_i64 = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
};

module.exports.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_shr = function(arg0, arg1) {
    const ret = getObject(arg0) >> getObject(arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbindgen_in = function(arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1);
    return ret;
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
    const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
};

module.exports.__wbindgen_as_number = function(arg0) {
    const ret = +getObject(arg0);
    return ret;
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_getwithrefkey_edc2c8960f0f1191 = function(arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
};

module.exports.__wbg_set_f975102236d3c502 = function(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

module.exports.__wbg_get_bd8e338fbd5f5cc8 = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

module.exports.__wbg_length_cd7af8117672b8b8 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_new_16b304a2cfa7ff4a = function() {
    const ret = new Array();
    return addHeapObject(ret);
};

module.exports.__wbg_BigInt_42b692c18e1ac6d6 = function(arg0) {
    const ret = BigInt(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbg_next_40fc327bfc8770e6 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbg_next_196c84450b364254 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_done_298b57d23c0fc80c = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_value_d93c65011f51a456 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_iterator_2cee6dadfd956dfa = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_72fb9a18b5ae2624 = function() {
    const ret = new Object();
    return addHeapObject(ret);
};

module.exports.__wbg_set_d4638f722068f043 = function(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

module.exports.__wbg_isArray_2ab64d95e09ea0ae = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

module.exports.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_isSafeInteger_f7b04ef02296c4d2 = function(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};

module.exports.__wbg_entries_95cc2c823b285a09 = function(arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_new_63b92bc8671ed464 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_length_c20a40f15020d68a = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'oraiswap_v3_wasm_bg_main.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

