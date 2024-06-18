import RangeInput from '@components/Inputs/RangeInput/RangeInput'
import PlotTypeSwitch from '@components/PlotTypeSwitch/PlotTypeSwitch'
import PriceRangePlot from '@components/PriceRangePlot/PriceRangePlot'
import { Button, Grid, Tooltip, Typography } from '@mui/material'
import loader from '@static/gif/loader.gif'
import activeLiquidity from '@static/svg/activeLiquidity.svg'
import { PositionOpeningMethod } from '@store/consts/static'
import {
  calcPrice,
  calcTicksAmountInRange,
  calculateConcentrationRange,
  nearestTickIndex,
  toMaxNumericPlaces
} from '@store/consts/utils'
import { PlotTickData, TickPlotPositionData } from '@store/reducers/positions'
import React, { useEffect, useRef, useState } from 'react'
import ConcentrationSlider from '../ConcentrationSlider/ConcentrationSlider'
import useStyles from './style'
import { getMaxTick, getMinTick } from '@wasm'

export interface IRangeSelector {
  data: PlotTickData[] | any
  midPrice: TickPlotPositionData | any
  tokenASymbol: string
  tokenBSymbol: string
  onChangeRange: (leftIndex: number, rightIndex: number) => void
  blocked?: boolean
  blockerInfo?: string
  ticksLoading: boolean
  isXtoY: boolean
  xDecimal: number
  yDecimal: number
  tickSpacing: number
  currentPairReversed: boolean | null
  initialIsDiscreteValue: boolean
  onDiscreteChange: (val: boolean) => void
  positionOpeningMethod?: PositionOpeningMethod
  poolIndex: number | null
  hasTicksError?: boolean
  reloadHandler: () => void
  concentrationArray: number[]
  minimumSliderIndex: number
  concentrationIndex: number
  setConcentrationIndex: (val: number) => void
  getTicksInsideRange: (
    left: number,
    right: number,
    isXtoY: boolean
  ) => {
    leftInRange: number
    rightInRange: number
  }
}

export const RangeSelector: React.FC<IRangeSelector> = ({
  data,
  midPrice,
  tokenASymbol,
  tokenBSymbol,
  onChangeRange,
  blocked = false,
  blockerInfo,
  ticksLoading,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing,
  currentPairReversed,
  initialIsDiscreteValue,
  onDiscreteChange,
  positionOpeningMethod,
  hasTicksError,
  reloadHandler,
  concentrationArray,
  minimumSliderIndex,
  concentrationIndex,
  setConcentrationIndex,
  getTicksInsideRange
}) => {
  const { classes } = useStyles()

  const [leftRange, setLeftRange] = useState(getMinTick(tickSpacing))
  const [rightRange, setRightRange] = useState(getMaxTick(tickSpacing))

  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')

  const [leftInputRounded, setLeftInputRounded] = useState('')
  const [rightInputRounded, setRightInputRounded] = useState('')

  const [plotMin, setPlotMin] = useState(0)
  const [plotMax, setPlotMax] = useState(1)

  const [isPlotDiscrete, setIsPlotDiscrete] = useState(initialIsDiscreteValue)

  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const zoomMinus = () => {
    const diff = plotMax - plotMin
    const newMin = plotMin - diff / 4
    const newMax = plotMax + diff / 4
    setPlotMin(newMin)
    setPlotMax(newMax)
  }

  const zoomPlus = () => {
    const diff = plotMax - plotMin
    const newMin = plotMin + diff / 6
    const newMax = plotMax - diff / 6
    if (
      calcTicksAmountInRange(
        Math.max(newMin, 0),
        newMax,
        tickSpacing,
        isXtoY,
        Number(xDecimal),
        Number(yDecimal)
      ) >= 4
    ) {
      setPlotMin(newMin)
      setPlotMax(newMax)
    }
  }

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
    let leftRange: number
    let rightRange: number

    if (positionOpeningMethod === 'range') {
      const { leftInRange, rightInRange } = getTicksInsideRange(left, right, isXtoY)
      leftRange = leftInRange
      rightRange = rightInRange
    } else {
      leftRange = left
      rightRange = right
    }

    setLeftRange(Number(leftRange))
    setRightRange(Number(rightRange))

    setLeftInputValues(calcPrice(Number(leftRange), isXtoY, xDecimal, yDecimal).toString())
    setRightInputValues(calcPrice(Number(rightRange), isXtoY, xDecimal, yDecimal).toString())

    onChangeRange(left, right)
  }

  const resetPlot = () => {
    if (positionOpeningMethod === 'range') {
      const initSideDist = Math.abs(
        midPrice.x -
          calcPrice(
            Math.max(getMinTick(tickSpacing), Number(midPrice.index) - tickSpacing * 15),
            isXtoY,
            xDecimal,
            yDecimal
          )
      )

      const higherTick = Math.max(
        Number(getMinTick(Number(tickSpacing))),
        Number(midPrice.index) - Number(tickSpacing) * 10
      )

      const lowerTick = Math.min(
        Number(getMaxTick(Number(tickSpacing))),
        Number(midPrice.index) + Number(tickSpacing) * 10
      )

      changeRangeHandler(isXtoY ? higherTick : lowerTick, isXtoY ? lowerTick : higherTick)

      setPlotMin(midPrice.x - initSideDist)
      setPlotMax(midPrice.x + initSideDist)
    } else {
      setConcentrationIndex(0)
      const { leftRange, rightRange } = calculateConcentrationRange(
        tickSpacing,
        concentrationArray[0],
        2,
        midPrice.index,
        isXtoY
      )
      changeRangeHandler(leftRange, rightRange)
      autoZoomHandler(leftRange, rightRange, true)
    }
  }

  const reversePlot = () => {
    changeRangeHandler(rightRange, leftRange)
    if (plotMin > 0) {
      const pom = 1 / plotMin
      setPlotMin(1 / plotMax)
      setPlotMax(pom)
    } else {
      const initSideDist = Math.abs(
        midPrice.x -
          calcPrice(
            Math.max(getMinTick(tickSpacing), midPrice.index - tickSpacing * 15),
            isXtoY,
            xDecimal,
            yDecimal
          )
      )

      setPlotMin(midPrice.x - initSideDist)
      setPlotMax(midPrice.x + initSideDist)
    }
  }

  useEffect(() => {
    if (currentPairReversed !== null && isMountedRef.current) {
      reversePlot()
    }
  }, [currentPairReversed])

  useEffect(() => {
    if (!ticksLoading && isMountedRef.current) {
      resetPlot()
    }
  }, [ticksLoading, midPrice])

  const autoZoomHandler = (left: number, right: number, canZoomCloser: boolean = false) => {
    const leftX = calcPrice(left, isXtoY, xDecimal, yDecimal)
    const rightX = calcPrice(right, isXtoY, xDecimal, yDecimal)

    const higherLeftIndex = Math.max(getMinTick(tickSpacing), left - tickSpacing * 15)

    const lowerLeftIndex = Math.min(getMaxTick(tickSpacing), left + tickSpacing * 15)

    const lowerRightIndex = Math.min(getMaxTick(tickSpacing), right + tickSpacing * 15)

    const higherRightIndex = Math.max(getMinTick(tickSpacing), right - tickSpacing * 15)

    if (leftX < plotMin || rightX > plotMax || canZoomCloser) {
      const leftDist = Math.abs(
        leftX - calcPrice(isXtoY ? higherLeftIndex : lowerLeftIndex, isXtoY, xDecimal, yDecimal)
      )
      const rightDist = Math.abs(
        rightX - calcPrice(isXtoY ? lowerRightIndex : higherRightIndex, isXtoY, xDecimal, yDecimal)
      )

      let dist

      if (leftX < plotMin && rightX > plotMax) {
        dist = Math.max(leftDist, rightDist)
      } else if (leftX < plotMin) {
        dist = leftDist
      } else {
        dist = rightDist
      }

      setPlotMin(leftX - dist)
      setPlotMax(rightX + dist)
    }
  }

  useEffect(() => {
    if (positionOpeningMethod === 'concentration' && isMountedRef.current && !ticksLoading) {
      setConcentrationIndex(0)
      const { leftRange, rightRange } = calculateConcentrationRange(
        tickSpacing,
        concentrationArray[0],
        2,
        midPrice.index,
        isXtoY
      )
      changeRangeHandler(leftRange, rightRange)
      autoZoomHandler(leftRange, rightRange, true)
    } else {
      changeRangeHandler(leftRange, rightRange)
    }
  }, [positionOpeningMethod])

  useEffect(() => {
    if (positionOpeningMethod === 'concentration' && !ticksLoading && isMountedRef.current) {
      const index =
        concentrationIndex > concentrationArray.length - 1
          ? concentrationArray.length - 1
          : concentrationIndex
      setConcentrationIndex(index)
      const { leftRange, rightRange } = calculateConcentrationRange(
        tickSpacing,
        concentrationArray[index],
        2,
        midPrice.index,
        isXtoY
      )
      changeRangeHandler(leftRange, rightRange)
      autoZoomHandler(leftRange, rightRange, true)
    }
  }, [midPrice.index, concentrationArray])

  return (
    <Grid container className={classes.wrapper} direction='column'>
      <Grid className={classes.headerContainer} container justifyContent='space-between'>
        <Typography className={classes.header}>Price range</Typography>
        <PlotTypeSwitch
          onSwitch={val => {
            setIsPlotDiscrete(val)
            onDiscreteChange(val)
          }}
          initialValue={isPlotDiscrete ? 1 : 0}
        />
      </Grid>
      <Grid className={classes.infoRow} container justifyContent='flex-end'>
        <Grid container direction='column' alignItems='flex-end'>
          <Tooltip
            title={
              <>
                <Typography className={classes.liquidityTitle}>Active liquidity</Typography>
                <Typography className={classes.liquidityDesc} style={{ marginBottom: 12 }}>
                  While selecting the price range, note where active liquidity is located. Your
                  liquidity can be inactive and, as a consequence, not generate profits.
                </Typography>
                <Grid
                  container
                  direction='row'
                  wrap='nowrap'
                  alignItems='center'
                  style={{ marginBottom: 12 }}>
                  <Typography className={classes.liquidityDesc}>
                    The active liquidity range is represented by white, dashed lines in the
                    liquidity chart. Active liquidity is determined by the maximum price range
                    resulting from the statistical volume of swaps for the last 7 days.
                  </Typography>
                  <img className={classes.liquidityImg} src={activeLiquidity} />
                </Grid>
                <Typography className={classes.liquidityNote}>
                  Note: active liquidity borders are always aligned to the nearest initialized
                  ticks.
                </Typography>
              </>
            }
            placement='bottom'
            classes={{
              tooltip: classes.liquidityTooltip
            }}>
            <Typography className={classes.activeLiquidity}>
              Active liquidity <span className={classes.activeLiquidityIcon}>i</span>
            </Typography>
          </Tooltip>
          <Grid>
            <Typography className={classes.currentPrice}>Current price</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.innerWrapper}>
        <PriceRangePlot
          className={classes.plot}
          data={data}
          onChangeRange={changeRangeHandler}
          leftRange={{
            index: leftRange,
            x: calcPrice(leftRange, isXtoY, xDecimal, yDecimal)
          }}
          rightRange={{
            index: rightRange,
            x: calcPrice(rightRange, isXtoY, xDecimal, yDecimal)
          }}
          midPrice={midPrice}
          plotMin={plotMin}
          plotMax={plotMax}
          zoomMinus={zoomMinus}
          zoomPlus={zoomPlus}
          loading={ticksLoading}
          isXtoY={isXtoY}
          tickSpacing={tickSpacing}
          xDecimal={xDecimal}
          yDecimal={yDecimal}
          isDiscrete={isPlotDiscrete}
          disabled={positionOpeningMethod === 'concentration'}
          hasError={hasTicksError}
          reloadHandler={reloadHandler}
        />
        <Typography className={classes.subheader}>Set price range</Typography>
        <Grid container className={classes.inputs}>
          <RangeInput
            disabled={positionOpeningMethod === 'concentration'}
            className={classes.input}
            label='Min price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={leftInputRounded}
            setValue={onLeftInputChange}
            decreaseValue={() => {
              const newLeft = isXtoY
                ? Math.max(
                    Number(getMinTick(Number(tickSpacing))),
                    Number(leftRange - Number(tickSpacing))
                  )
                : Math.min(
                    Number(getMaxTick(Number(tickSpacing))),
                    Number(leftRange + Number(tickSpacing))
                  )
              changeRangeHandler(newLeft, rightRange)
              autoZoomHandler(newLeft, rightRange)
            }}
            increaseValue={() => {
              const newLeft = isXtoY
                ? Math.min(
                    Number(rightRange - Number(tickSpacing)),
                    Number(leftRange + Number(tickSpacing))
                  )
                : Math.max(
                    Number(rightRange + Number(tickSpacing)),
                    Number(leftRange - Number(tickSpacing))
                  )
              changeRangeHandler(newLeft, rightRange)
              autoZoomHandler(newLeft, rightRange)
            }}
            onBlur={() => {
              const newLeft = isXtoY
                ? Math.min(
                    rightRange - tickSpacing,
                    nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal)
                  )
                : Math.max(
                    rightRange + tickSpacing,
                    nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal)
                  )

              changeRangeHandler(newLeft, rightRange)
              autoZoomHandler(newLeft, rightRange)
            }}
            diffLabel='Min - Current price'
            percentDiff={((+leftInput - midPrice.x) / midPrice.x) * 100}
          />
          <RangeInput
            disabled={positionOpeningMethod === 'concentration'}
            className={classes.input}
            label='Max price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={rightInputRounded}
            setValue={onRightInputChange}
            decreaseValue={() => {
              const newRight = isXtoY
                ? Math.max(
                    Number(rightRange - Number(tickSpacing)),
                    Number(leftRange + Number(tickSpacing))
                  )
                : Math.min(
                    Number(rightRange + Number(tickSpacing)),
                    Number(leftRange - Number(tickSpacing))
                  )
              changeRangeHandler(leftRange, newRight)
              autoZoomHandler(leftRange, newRight)
            }}
            increaseValue={() => {
              const newRight = isXtoY
                ? Math.min(
                    Number(getMaxTick(Number(tickSpacing))),
                    Number(rightRange + Number(tickSpacing))
                  )
                : Math.max(
                    Number(getMinTick(Number(tickSpacing))),
                    Number(rightRange - Number(tickSpacing))
                  )
              changeRangeHandler(leftRange, newRight)
              autoZoomHandler(leftRange, newRight)
            }}
            onBlur={() => {
              const newRight = isXtoY
                ? Math.max(
                    Number(leftRange + Number(tickSpacing)),
                    Number(
                      nearestTickIndex(+rightInput, Number(tickSpacing), isXtoY, xDecimal, yDecimal)
                    )
                  )
                : Math.min(
                    Number(leftRange - Number(tickSpacing)),
                    Number(
                      nearestTickIndex(+rightInput, Number(tickSpacing), isXtoY, xDecimal, yDecimal)
                    )
                  )

              changeRangeHandler(leftRange, newRight)
              autoZoomHandler(leftRange, newRight)
            }}
            diffLabel='Max - Current price'
            percentDiff={((+rightInput - midPrice.x) / midPrice.x) * 100}
          />
        </Grid>
        {positionOpeningMethod === 'concentration' ? (
          <Grid container className={classes.sliderWrapper}>
            <ConcentrationSlider
              valueIndex={concentrationIndex}
              values={concentrationArray}
              valueChangeHandler={value => {
                setConcentrationIndex(value)
                const { leftRange, rightRange } = calculateConcentrationRange(
                  tickSpacing,
                  concentrationArray[value],
                  2,
                  midPrice.index,
                  isXtoY
                )
                changeRangeHandler(leftRange, rightRange)
                autoZoomHandler(leftRange, rightRange, true)
              }}
              dragHandler={value => {
                setConcentrationIndex(value)
              }}
              minimumSliderIndex={minimumSliderIndex}
            />
          </Grid>
        ) : (
          <Grid container className={classes.buttons}>
            <Button className={classes.button} onClick={resetPlot}>
              Reset range
            </Button>
            <Button
              className={classes.button}
              onClick={() => {
                const left = isXtoY
                  ? getMinTick(Number(tickSpacing))
                  : getMaxTick(Number(tickSpacing))
                const right = isXtoY
                  ? getMaxTick(Number(tickSpacing))
                  : getMinTick(Number(tickSpacing))
                changeRangeHandler(left, right)
                autoZoomHandler(left, right)
              }}>
              Set full range
            </Button>
          </Grid>
        )}
      </Grid>

      {blocked && (
        <Grid className={classes.blocker}>
          {blockerInfo === 'Loading pool info...' ? (
            <Grid container style={{ height: '100%' }}>
              <img src={loader} className={classes.loader} />
            </Grid>
          ) : (
            <Typography className={classes.blockedInfo}>{blockerInfo}</Typography>
          )}
        </Grid>
      )}
    </Grid>
  )
}

export default RangeSelector
