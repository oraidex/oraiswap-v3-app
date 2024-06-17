import { parse } from '@store/consts/utils'
import { positionToTick, LiquidityTick } from '@wasm'

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
          const tickIndex = positionToTick(chunkIndex, i, tickSpacing)
          ticks.push(Number(tickIndex.toString()))
        }
      }
    })

    expect(ticks).toEqual([-10, 10])
  })

  it('test parse', async () => {
    const liquidityTick: LiquidityTick = parse({
      index: 1,
      sign: true,
      liquidity_change: '10000'
    })

    expect(liquidityTick).toEqual({
      index: 1,
      sign: true,
      liquidity_change: 10000n
    })
  })
})
