import { positionToTick } from '../wasm'

const MAX_TICK = 221_818

const position_to_tick = (chunk: number, bit: number, tick_spacing: number): number => {
  let tick_range_limit = MAX_TICK - (MAX_TICK % tick_spacing)
  return chunk * 64 * tick_spacing + bit * tick_spacing - tick_range_limit
}

describe('utils', () => {
  it('test postion to tick', async () => {
    const tickSpacing = 1

    const bitmap = [
      [3465n, 281474976710656n],
      [3466n, 16n]
    ]

    const ticks: number[] = []

    bitmap.forEach(([chunkIndex, chunk]) => {
      for (let i = 0; i < 64; i++) {
        if ((chunk & (1n << BigInt(i))) != 0n) {
          const tickIndex = position_to_tick(Number(chunkIndex), i, tickSpacing)
          ticks.push(Number(tickIndex.toString()))
        }
      }
    })

    expect(ticks).toEqual([-10, 10])
  })
})
