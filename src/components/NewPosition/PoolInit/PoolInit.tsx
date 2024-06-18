import AnimatedNumber from '@components/AnimatedNumber'
import RangeInput from '@components/Inputs/RangeInput/RangeInput'
import SimpleInput from '@components/Inputs/SimpleInput/SimpleInput'
import { Button, Grid, Typography } from '@mui/material'
import {
  calcPrice,
  get_tick_at_sqrt_priceFromBalance,
  formatNumbers,
  nearestTickIndex,
  showPrefix,
  toMaxNumericPlaces
} from '@store/consts/utils'
import React, { useEffect, useMemo, useState } from 'react'
import useStyles from './style'
import { Price, get_max_tick, get_min_tick } from '@wasm'

export interface IPoolInit {
  tokenASymbol: string
  tokenBSymbol: string
  onChangeRange: (leftIndex: number | bigint, rightIndex: number | bigint) => void
  isXtoY: boolean
  xDecimal: bigint
  yDecimal: bigint
  tickSpacing: number
  midPrice: number
  onChangeMidPrice: (mid: Price) => void
  currentPairReversed: boolean | null
}

export const PoolInit: React.FC<IPoolInit> = ({
  tokenASymbol,
  tokenBSymbol,
  onChangeRange,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing,
  midPrice,
  onChangeMidPrice,
  currentPairReversed
}) => {
  const { classes } = useStyles()

  const [leftRange, setLeftRange] = useState(tickSpacing * 10 * (isXtoY ? -1 : 1))
  const [rightRange, setRightRange] = useState(tickSpacing * 10 * (isXtoY ? 1 : -1))

  const [leftInput, setLeftInput] = useState(
    calcPrice(leftRange, isXtoY, xDecimal, yDecimal).toString()
  )
  const [rightInput, setRightInput] = useState(
    calcPrice(rightRange, isXtoY, xDecimal, yDecimal).toString()
  )

  const [leftInputRounded, setLeftInputRounded] = useState((+leftInput).toFixed(12))
  const [rightInputRounded, setRightInputRounded] = useState((+rightInput).toFixed(12))

  const [midPriceInput, setMidPriceInput] = useState(
    calcPrice(midPrice, isXtoY, xDecimal, yDecimal).toString()
  )

  useEffect(() => {
    const tickIndex = get_tick_at_sqrt_priceFromBalance(
      +midPriceInput,
      tickSpacing,
      isXtoY,
      xDecimal,
      yDecimal
    )

    onChangeMidPrice(BigInt(tickIndex))
  }, [midPriceInput])

  const setLeftInputValues = (val: string) => {
    setLeftInput(val)
    setLeftInputRounded(toMaxNumericPlaces(+val, 5))
  }

  const setRightInputValues = (val: string) => {
    setRightInput(val)
    setRightInputRounded(toMaxNumericPlaces(+val, 5))
  }

  const onLeftInputChange = (val: string) => {
    setLeftInput(val)
    setLeftInputRounded(val)
  }

  const onRightInputChange = (val: string) => {
    setRightInput(val)
    setRightInputRounded(val)
  }

  const changeRangeHandler = (left: number, right: number) => {
    setLeftRange(left)
    setRightRange(right)

    setLeftInputValues(calcPrice(left, isXtoY, xDecimal, yDecimal).toString())
    setRightInputValues(calcPrice(right, isXtoY, xDecimal, yDecimal).toString())

    onChangeRange(left, right)
  }

  const resetRange = () => {
    changeRangeHandler(tickSpacing * 10 * (isXtoY ? -1 : 1), tickSpacing * 10 * (isXtoY ? 1 : -1))
  }

  useEffect(() => {
    changeRangeHandler(leftRange, rightRange)
  }, [midPrice])

  const validateMidPriceInput = (midPriceInput: string) => {
    const minTick = get_min_tick(tickSpacing)
    const maxTick = get_max_tick(tickSpacing)
    const minPrice = isXtoY
      ? calcPrice(minTick, isXtoY, xDecimal, yDecimal)
      : calcPrice(maxTick, isXtoY, xDecimal, yDecimal)
    const maxPrice = isXtoY
      ? calcPrice(maxTick, isXtoY, xDecimal, yDecimal)
      : calcPrice(minTick, isXtoY, xDecimal, yDecimal)
    const numericMidPriceInput = parseFloat(midPriceInput)
    const validatedMidPrice = Math.min(Math.max(numericMidPriceInput, minPrice), maxPrice)
    return toMaxNumericPlaces(validatedMidPrice, 5)
  }

  useEffect(() => {
    if (currentPairReversed !== null) {
      const validatedMidPrice = validateMidPriceInput((1 / +midPriceInput).toString())

      setMidPriceInput(validatedMidPrice)
      changeRangeHandler(rightRange, leftRange)
    }
  }, [currentPairReversed])

  const price = useMemo(
    () => calcPrice(midPrice, isXtoY, xDecimal, yDecimal),
    [midPrice, isXtoY, xDecimal, yDecimal]
  )

  return (
    <Grid container direction='column' className={classes.wrapper}>
      <Grid
        container
        className={classes.innerWrapper}
        direction='column'
        justifyContent='flex-start'>
        <Grid className={classes.topInnerWrapper}>
          <Typography className={classes.header}>Starting price</Typography>
          <Grid className={classes.infoWrapper}>
            <Typography className={classes.info}>
              This pool does not exist yet. To create it, select the fee tier, initial price, and
              enter the amount of tokens. The estimated cost of creating a pool is 0.003 AZERO.
            </Typography>
          </Grid>

          <SimpleInput
            setValue={setMidPriceInput}
            value={midPriceInput}
            decimal={isXtoY ? xDecimal : yDecimal}
            className={classes.midPrice}
            placeholder='0.0'
            onBlur={e => {
              setMidPriceInput(validateMidPriceInput(e.target.value || '0'))
            }}
          />

          <Grid
            className={classes.priceWrapper}
            container
            justifyContent='space-between'
            alignItems='center'>
            <Typography className={classes.priceLabel}>{tokenASymbol} starting price: </Typography>
            <Typography className={classes.priceValue}>
              <AnimatedNumber
                value={price.toFixed(isXtoY ? Number(xDecimal) : Number(yDecimal))}
                duration={300}
                formatValue={formatNumbers()}
              />
              {showPrefix(price)} {tokenBSymbol}
            </Typography>
          </Grid>
        </Grid>
        <Typography className={classes.subheader}>Set price range</Typography>
        <Grid container className={classes.inputs}>
          <RangeInput
            className={classes.input}
            label='Min price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={leftInputRounded}
            setValue={onLeftInputChange}
            decreaseValue={() => {
              const newLeft = isXtoY
                ? Math.max(Number(get_min_tick(tickSpacing)), Number(leftRange - tickSpacing))
                : Math.min(Number(get_max_tick(tickSpacing)), Number(leftRange + tickSpacing))
              changeRangeHandler(newLeft, rightRange)
            }}
            increaseValue={() => {
              const newLeft = isXtoY
                ? Math.min(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                : Math.max(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing))
              changeRangeHandler(newLeft, rightRange)
            }}
            onBlur={() => {
              const newLeft = isXtoY
                ? Math.min(
                    Number(rightRange - tickSpacing),
                    Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )
                : Math.max(
                    Number(rightRange + tickSpacing),
                    Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )
              changeRangeHandler(newLeft, rightRange)
            }}
            diffLabel='Min - Current price'
            percentDiff={((+leftInput - price) / price) * 100}
          />
          <RangeInput
            className={classes.input}
            label='Max price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={rightInputRounded}
            setValue={onRightInputChange}
            decreaseValue={() => {
              const newRight = isXtoY
                ? Math.max(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                : Math.min(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing))
              changeRangeHandler(leftRange, newRight)
            }}
            increaseValue={() => {
              const newRight = isXtoY
                ? Math.min(Number(get_max_tick(tickSpacing)), Number(rightRange + tickSpacing))
                : Math.max(Number(get_min_tick(tickSpacing)), Number(rightRange - tickSpacing))
              changeRangeHandler(leftRange, newRight)
            }}
            onBlur={() => {
              const newRight = isXtoY
                ? Math.max(
                    Number(leftRange + tickSpacing),
                    Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )
                : Math.min(
                    Number(leftRange - tickSpacing),
                    Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )

              changeRangeHandler(leftRange, newRight)
            }}
            diffLabel='Max - Current price'
            percentDiff={((+rightInput - price) / price) * 100}
          />
        </Grid>
        <Grid container className={classes.buttons}>
          <Button className={classes.button} onClick={resetRange}>
            Reset range
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              changeRangeHandler(
                isXtoY ? get_min_tick(tickSpacing) : get_max_tick(tickSpacing),
                isXtoY ? get_max_tick(tickSpacing) : get_min_tick(tickSpacing)
              )
            }}>
            Set full range
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PoolInit
