import { EmptyPlaceholder } from '@components/EmptyPlaceholder/EmptyPlaceholder'
import PositionDetails from '@components/PositionDetails/PositionDetails'
import { Grid } from '@mui/material'
import loader from '@static/gif/loader.gif'
import { TokenPriceData } from '@store/consts/static'
import {
  calcPrice,
  calcYPerXPriceByTickIndex,
  calculateFee,
  calculateTokenAmounts,
  createPlaceholderLiquidityPlot,
  getCoingeckoTokenPrice,
  poolKeyToString,
  printBigint
} from '@store/consts/utils'
import { actions as poolsActions } from '@store/reducers/pools'
import { actions } from '@store/reducers/positions'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { Status } from '@store/reducers/wallet'
import { networkType } from '@store/selectors/connection'
import { poolsArraySortedByFees } from '@store/selectors/pools'
import {
  currentPositionTicks,
  isLoadingPositionsList,
  plotTicks,
  singlePositionData
} from '@store/selectors/positions'
import { status } from '@store/selectors/wallet'
import { VariantType } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import useStyles from './style'

export interface IProps {
  address: string
  id: bigint
}

export const SinglePositionWrapper: React.FC<IProps> = ({ id }) => {
  const { classes } = useStyles()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const allPools = useSelector(poolsArraySortedByFees)
  const currentNetwork = useSelector(networkType)
  const position = useSelector(singlePositionData(id))
  const isLoadingList = useSelector(isLoadingPositionsList)
  const { data: ticksData, loading: ticksLoading, hasError: hasTicksError } = useSelector(plotTicks)
  const {
    lowerTick,
    upperTick,
    loading: currentPositionTicksLoading
  } = useSelector(currentPositionTicks)
  const walletStatus = useSelector(status)

  const [waitingForTicksData, setWaitingForTicksData] = useState<boolean | null>(null)

  const [showFeesLoader, setShowFeesLoader] = useState(true)

  const [isFinishedDelayRender, setIsFinishedDelayRender] = useState(false)

  useEffect(() => {
    if (position?.tokenX && position.tokenY) {
      dispatch(
        poolsActions.getTicksAndTickMaps({
          tokenFrom: position.tokenX.address,
          tokenTo: position.tokenY.address,
          allPools
        })
      )
    }
    if (position && waitingForTicksData === null) {
      setWaitingForTicksData(true)
      dispatch(
        actions.getCurrentPositionTicks({
          poolKey: position.pool_key,
          lowerTickIndex: BigInt(position.lower_tick_index),
          upperTickIndex: BigInt(position.upper_tick_index)
        })
      )
      dispatch(
        actions.getCurrentPlotTicks({
          poolKey: position.pool_key,
          isXtoY: true
        })
      )
    }
  }, [position])

  useEffect(() => {
    if (waitingForTicksData === true && !currentPositionTicksLoading) {
      setWaitingForTicksData(false)
    }
  }, [currentPositionTicksLoading])

  const midPrice = useMemo(() => {
    if (position?.poolData) {
      return {
        index: position.poolData.poolIndex,
        x: calcYPerXPriceByTickIndex(
          BigInt(position.poolData.poolIndex),
          position.tokenX.decimals,
          position.tokenY.decimals
        )
      }
    }

    return {
      index: 0n,
      x: 0
    }
  }, [position?.pool_key])

  const leftRange = useMemo(() => {
    if (position) {
      return {
        index: position.lower_tick_index,
        x: calcPrice(
          BigInt(position.lower_tick_index),
          true,
          position.tokenX.decimals,
          position.tokenY.decimals
        )
      }
    }

    return {
      index: 0n,
      x: 0
    }
  }, [position?.pool_key])

  const rightRange = useMemo(() => {
    if (position) {
      return {
        index: position.upper_tick_index,
        x: calcPrice(
          BigInt(position.upper_tick_index),
          true,
          position.tokenX.decimals,
          position.tokenY.decimals
        )
      }
    }

    return {
      index: 0n,
      x: 0
    }
  }, [position?.pool_key])

  const min = useMemo(
    () =>
      position
        ? calcYPerXPriceByTickIndex(
            BigInt(position.lower_tick_index),
            position.tokenX.decimals,
            position.tokenY.decimals
          )
        : 0,
    [position?.lower_tick_index]
  )
  const max = useMemo(
    () =>
      position
        ? calcYPerXPriceByTickIndex(
            BigInt(position.upper_tick_index),
            position.tokenX.decimals,
            position.tokenY.decimals
          )
        : 0,
    [position?.upper_tick_index]
  )
  const current = useMemo(
    () =>
      position?.poolData
        ? calcYPerXPriceByTickIndex(
            position.poolData.poolIndex,
            position.tokenX.decimals,
            position.tokenY.decimals
          )
        : 0,
    [position]
  )

  const [tokenXLiquidity, tokenYLiquidity] = useMemo(() => {
    if (position?.poolData) {
      const [x, y] = calculateTokenAmounts(position.poolData, position)

      return [+printBigint(x, position.tokenX.decimals), +printBigint(y, position.tokenY.decimals)]
    }

    return [0, 0]
  }, [position])

  const [tokenXClaim, tokenYClaim] = useMemo(() => {
    if (
      waitingForTicksData === false &&
      position?.poolData &&
      typeof lowerTick !== 'undefined' &&
      typeof upperTick !== 'undefined' &&
      position.poolData
    ) {
      const [bnX, bnY] = calculateFee(position.poolData, position, lowerTick, upperTick)

      setShowFeesLoader(false)

      return [
        +printBigint(bnX, position.tokenX.decimals),
        +printBigint(bnY, position.tokenY.decimals)
      ]
    }

    return [0, 0]
  }, [position, lowerTick, upperTick, waitingForTicksData])

  const data = useMemo(() => {
    if (ticksLoading && position) {
      return createPlaceholderLiquidityPlot(
        true,
        10,
        BigInt(position.pool_key.fee_tier.tick_spacing),
        position.tokenX.decimals,
        position.tokenY.decimals
      )
    }

    return ticksData
  }, [ticksData, ticksLoading, position, position?.tokenX, position?.tokenY])

  const initialIsDiscreteValue = localStorage.getItem('IS_PLOT_DISCRETE')
    ? localStorage.getItem('IS_PLOT_DISCRETE') === 'true'
    : true

  const setIsDiscreteValue = (val: boolean) => {
    localStorage.setItem('IS_PLOT_DISCRETE', val ? 'true' : 'false')
  }

  const [tokenXPriceData, setTokenXPriceData] = useState<TokenPriceData | undefined>(undefined)
  const [tokenYPriceData, setTokenYPriceData] = useState<TokenPriceData | undefined>(undefined)

  useEffect(() => {
    if (!position) {
      return
    }

    const xId = position.tokenX.coingeckoId ?? ''
    if (xId.length) {
      getCoingeckoTokenPrice(xId).then(data => setTokenXPriceData(data))
    } else {
      setTokenXPriceData(undefined)
    }

    const yId = position.tokenY.coingeckoId ?? ''
    if (yId.length) {
      getCoingeckoTokenPrice(yId).then(data => setTokenYPriceData(data))
    } else {
      setTokenYPriceData(undefined)
    }
  }, [position])

  const copyPoolAddressHandler = (message: string, variant: VariantType) => {
    dispatch(
      snackbarsActions.add({
        message,
        variant,
        persist: false
      })
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinishedDelayRender(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [walletStatus])

  useEffect(() => {
    if (isFinishedDelayRender) {
      setIsFinishedDelayRender(false)
    }
  }, [walletStatus])

  useEffect(() => {
    dispatch(actions.getSinglePosition(id))
  }, [])

  if (position) {
    return (
      <PositionDetails
        tokenXAddress={position.pool_key.token_x}
        tokenYAddress={position.pool_key.token_y}
        poolAddress={position ? poolKeyToString(position.pool_key) : ''}
        copyPoolAddressHandler={copyPoolAddressHandler}
        detailsData={data}
        midPrice={midPrice}
        leftRange={leftRange}
        rightRange={rightRange}
        currentPrice={current}
        onClickClaimFee={() =>
          dispatch(
            actions.claimFee({
              index: id,
              addressTokenX: position?.pool_key.token_x,
              addressTokenY: position?.pool_key.token_y
            })
          )
        }
        closePosition={() =>
          dispatch(
            actions.closePosition({
              positionIndex: id,
              onSuccess: () => {
                navigate('/pool')
              },
              addressTokenX: position.pool_key.token_x,
              addressTokenY: position.pool_key.token_y
            })
          )
        }
        ticksLoading={ticksLoading}
        tickSpacing={BigInt(position.pool_key.fee_tier.tick_spacing)}
        tokenX={{
          name: position.tokenX.symbol,
          icon: position.tokenX.logoURI,
          decimal: position.tokenX.decimals,
          balance: +printBigint(position.tokenX.balance ?? 0n, position.tokenX.decimals),
          liqValue: tokenXLiquidity,
          claimValue: tokenXClaim,
          usdValue:
            typeof tokenXPriceData?.price === 'undefined'
              ? undefined
              : tokenXPriceData.price *
                +printBigint(position.tokenX.balance ?? 0n, position.tokenX.decimals)
        }}
        tokenXPriceData={tokenXPriceData}
        tokenY={{
          name: position.tokenY.symbol,
          icon: position.tokenY.logoURI,
          decimal: position.tokenY.decimals,
          balance: +printBigint(position.tokenY.balance ?? 0n, position.tokenY.decimals),
          liqValue: tokenYLiquidity,
          claimValue: tokenYClaim,
          usdValue:
            typeof tokenYPriceData?.price === 'undefined'
              ? undefined
              : tokenYPriceData.price *
                +printBigint(position.tokenY.balance ?? 0n, position.tokenY.decimals)
        }}
        tokenYPriceData={tokenYPriceData}
        fee={BigInt(position.pool_key.fee_tier.fee)}
        min={min}
        max={max}
        initialIsDiscreteValue={initialIsDiscreteValue}
        onDiscreteChange={setIsDiscreteValue}
        showFeesLoader={showFeesLoader}
        hasTicksError={hasTicksError}
        reloadHandler={() => {
          dispatch(
            actions.getCurrentPlotTicks({
              poolKey: position.pool_key,
              isXtoY: true
            })
          )
        }}
      />
    )
  }
  if (
    (isLoadingList && walletStatus === Status.Initialized) ||
    (!position && walletStatus === Status.Uninitialized && !isFinishedDelayRender)
  ) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        className={classes.fullHeightContainer}>
        <img src={loader} className={classes.loading} />
      </Grid>
    )
  }
  if (!position && walletStatus === Status.Initialized && isFinishedDelayRender) {
    return <Navigate to='/pool' />
  }
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      className={classes.fullHeightContainer}>
      <EmptyPlaceholder desc='Position does not exist in your list!' />
    </Grid>
  )
}
