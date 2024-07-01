import { ProgressState } from '@components/AnimatedButton/AnimatedButton';
import Slippage from '@components/Modals/Slippage/Slippage';
import { INoConnected, NoConnected } from '@components/NoConnected/NoConnected';
import { Button, Grid, Typography } from '@mui/material';

import backIcon from '@static/svg/back-arrow.svg';
import settingIcon from '@static/svg/settings.svg';
import {
  BestTier,
  PositionOpeningMethod,
  REFRESHER_INTERVAL,
  TokenPriceData
} from '@store/consts/static';
import {
  PERCENTAGE_DENOMINATOR,
  // PERCENTAGE_DENOMINATOR,
  PositionTokenBlock,
  calcPrice,
  calculateConcentrationRange,
  convertBalanceToBigint,
  determinePositionTokenBlock,
  getConcentrationArray,
  printBigint,
  trimLeadingZeros
} from '@store/consts/utils';
import { PlotTickData, TickPlotPositionData } from '@store/reducers/positions';
import { SwapToken } from '@store/selectors/wallet';
import { blurContent, unblurContent } from '@utils/uiUtils';
import { VariantType } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConcentrationTypeSwitch from './ConcentrationTypeSwitch/ConcentrationTypeSwitch';
import DepositSelector from './DepositSelector/DepositSelector';
import MarketIdLabel from './MarketIdLabel/MarketIdLabel';
import PoolInit from './PoolInit/PoolInit';
import RangeSelector from './RangeSelector/RangeSelector';
import useStyles from './style';
import { Price, TokenAmount, getMaxTick, getMinTick } from '@wasm';

export interface INewPosition {
  initialTokenFrom: string;
  initialTokenTo: string;
  initialFee: string;
  copyPoolAddressHandler: (message: string, variant: VariantType) => void;
  tokens: SwapToken[];
  data: PlotTickData[];
  midPrice: TickPlotPositionData;
  setMidPrice: (mid: TickPlotPositionData) => void;
  addLiquidityHandler: (
    leftTickIndex: number,
    rightTickIndex: number,
    xAmount: TokenAmount,
    yAmount: TokenAmount,
    slippage: bigint
  ) => void;
  onChangePositionTokens: (
    tokenAIndex: number | null,
    tokenBindex: number | null,
    feeTierIndex: number
  ) => void;
  isCurrentPoolExisting: boolean;
  calcAmount: (
    amount: TokenAmount,
    leftRangeTickIndex: number,
    rightRangeTickIndex: number,
    tokenAddress: string
  ) => TokenAmount;
  feeTiers: Array<{
    feeValue: number;
  }>;
  ticksLoading: boolean;
  loadingTicksAndTickMaps: boolean;
  showNoConnected?: boolean;
  noConnectedBlockerProps: INoConnected;
  progress: ProgressState;
  isXtoY: boolean;
  xDecimal: number;
  yDecimal: number;
  tickSpacing: number;
  isWaitingForNewPool: boolean;
  poolIndex: number | null;
  currentPairReversed: boolean | null;
  bestTiers: BestTier[];
  initialIsDiscreteValue: boolean;
  onDiscreteChange: (val: boolean) => void;
  currentPriceSqrt: TokenAmount;
  canCreateNewPool: boolean;
  canCreateNewPosition: boolean;
  handleAddToken: (address: string) => void;
  // commonTokens: PublicKey[]
  commonTokens: any[];
  initialOpeningPositionMethod: PositionOpeningMethod;
  onPositionOpeningMethodChange: (val: PositionOpeningMethod) => void;
  initialHideUnknownTokensValue: boolean;
  onHideUnknownTokensChange: (val: boolean) => void;
  tokenAPriceData?: TokenPriceData;
  tokenBPriceData?: TokenPriceData;
  priceALoading?: boolean;
  priceBLoading?: boolean;
  hasTicksError?: boolean;
  reloadHandler: () => void;
  currentFeeIndex: number;
  onSlippageChange: (slippage: string) => void;
  initialSlippage: string;
  poolKey: string;
  onRefresh: () => void;
  // isBalanceLoading: boolean
}

export const NewPosition: React.FC<INewPosition> = ({
  initialTokenFrom,
  initialTokenTo,
  initialFee,
  tokens,
  data,
  midPrice,
  setMidPrice,
  addLiquidityHandler,
  progress = 'progress',
  onChangePositionTokens,
  isCurrentPoolExisting,
  calcAmount,
  feeTiers,
  ticksLoading,
  showNoConnected,
  noConnectedBlockerProps,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing,
  isWaitingForNewPool,
  poolIndex,
  currentPairReversed,
  bestTiers,
  initialIsDiscreteValue,
  onDiscreteChange,
  canCreateNewPool,
  canCreateNewPosition,
  handleAddToken,
  commonTokens,
  initialOpeningPositionMethod,
  initialHideUnknownTokensValue,
  onHideUnknownTokensChange,
  tokenAPriceData,
  tokenBPriceData,
  priceALoading,
  priceBLoading,
  hasTicksError,
  reloadHandler,
  currentFeeIndex,
  onSlippageChange,
  initialSlippage,
  poolKey,
  currentPriceSqrt,
  onRefresh
  // isBalanceLoading
}) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const [positionOpeningMethod, setPositionOpeningMethod] = useState<PositionOpeningMethod>(
    initialOpeningPositionMethod
  );

  const [leftRange, setLeftRange] = useState(getMinTick(Number(tickSpacing)));
  const [rightRange, setRightRange] = useState(getMaxTick(Number(tickSpacing)));

  const [tokenAIndex, setTokenAIndex] = useState<number | null>(null);
  const [tokenBIndex, setTokenBIndex] = useState<number | null>(null);

  const [tokenADeposit, setTokenADeposit] = useState<string>('');
  const [tokenBDeposit, setTokenBDeposit] = useState<string>('');

  const [settings, setSettings] = React.useState<boolean>(false);
  const [slippTolerance, setSlippTolerance] = React.useState<string>(initialSlippage);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [concentrationIndex, setConcentrationIndex] = useState(0);

  const [minimumSliderIndex, setMinimumSliderIndex] = useState<number>(0);
  const [refresherTime, setRefresherTime] = React.useState<number>(REFRESHER_INTERVAL);

  const concentrationArray = useMemo(
    () =>
      getConcentrationArray(Number(tickSpacing), 2, Number(midPrice.index)).sort((a, b) => a - b),
    [tickSpacing]
  );

  const setRangeBlockerInfo = () => {
    if (tokenAIndex === null || tokenBIndex === null) {
      return 'Select tokens to set price range.';
    }

    if (tokenAIndex === tokenBIndex) {
      return "Token A can't be the same as token B";
    }

    if (isWaitingForNewPool) {
      return 'Loading pool info...';
    }

    return '';
  };

  const noRangePlaceholderProps = {
    data: Array(100)
      .fill(1)
      .map((_e, index) => ({ x: index, y: index, index: index })),
    midPrice: {
      x: 50,
      index: 50
    },
    tokenASymbol: 'ABC',
    tokenBSymbol: 'XYZ'
  };

  const getOtherTokenAmount = (
    amount: TokenAmount,
    left: number,
    right: number,
    byFirst: boolean
  ) => {
    const [printIndex, calcIndex] = byFirst
      ? [tokenBIndex, tokenAIndex]
      : [tokenAIndex, tokenBIndex];
    if (printIndex === null || calcIndex === null) {
      return '0.0';
    }

    const result = calcAmount(amount, left, right, tokens[calcIndex].assetAddress);

    return trimLeadingZeros(printBigint(result, tokens[printIndex].decimals));
  };

  const getTicksInsideRange = (left: number, right: number, isXtoY: boolean) => {
    const leftMax = isXtoY ? getMinTick(tickSpacing) : getMaxTick(tickSpacing);
    const rightMax = isXtoY ? getMaxTick(tickSpacing) : getMinTick(tickSpacing);

    let leftInRange: number;
    let rightInRange: number;

    if (isXtoY) {
      leftInRange = left < leftMax ? leftMax : left;
      rightInRange = right > rightMax ? rightMax : right;
    } else {
      leftInRange = left > leftMax ? leftMax : left;
      rightInRange = right < rightMax ? rightMax : right;
    }

    return { leftInRange, rightInRange };
  };

  const onChangeRange = (left: number, right: number) => {
    let leftRange: number;
    let rightRange: number;

    if (positionOpeningMethod === 'range') {
      const { leftInRange, rightInRange } = getTicksInsideRange(left, right, isXtoY);
      leftRange = leftInRange;
      rightRange = rightInRange;
    } else {
      leftRange = left;
      rightRange = right;
    }
    leftRange = left;
    rightRange = right;
    // console.log({ tickSpacing, left, right });

    setLeftRange(Number(left));
    setRightRange(Number(right));

    if (
      tokenAIndex !== null &&
      (isXtoY ? rightRange > midPrice.index : rightRange < midPrice.index)
    ) {
      const deposit = tokenADeposit;
      // console.log({ deposit, leftRange, rightRange });
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, Number(tokens[tokenAIndex].decimals)),
        Number(leftRange),
        Number(rightRange),
        true
      );

      if (tokenBIndex !== null && +deposit !== 0) {
        setTokenADeposit(deposit);
        setTokenBDeposit(amount);
        return;
      }
    }

    if (
      tokenBIndex !== null &&
      (isXtoY ? leftRange < midPrice.index : leftRange > midPrice.index)
    ) {
      const deposit = tokenBDeposit;
      // console.log({ deposit, leftRange, rightRange });
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, Number(tokens[tokenBIndex].decimals)),
        Number(leftRange),
        Number(rightRange),
        false
      );

      if (tokenAIndex !== null && +deposit !== 0) {
        setTokenBDeposit(deposit);
        setTokenADeposit(amount);
      }
    }
  };

  const onChangeMidPrice = (mid: Price) => {
    const convertedMid = Number(mid);
    setMidPrice({
      index: convertedMid,
      x: calcPrice(convertedMid, isXtoY, xDecimal, yDecimal)
    });
    if (tokenAIndex !== null && (isXtoY ? rightRange > convertedMid : rightRange < convertedMid)) {
      const deposit = tokenADeposit;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokens[tokenAIndex].decimals),
        leftRange,
        rightRange,
        true
      );
      if (tokenBIndex !== null && +deposit !== 0) {
        setTokenADeposit(deposit);
        setTokenBDeposit(amount);
        return;
      }
    }
    if (tokenBIndex !== null && (isXtoY ? leftRange < convertedMid : leftRange > convertedMid)) {
      const deposit = tokenBDeposit;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokens[tokenBIndex].decimals),
        leftRange,
        rightRange,
        false
      );
      if (tokenAIndex !== null && +deposit !== 0) {
        setTokenBDeposit(deposit);
        setTokenADeposit(amount);
      }
    }
  };

  const bestTierIndex =
    tokenAIndex === null || tokenBIndex === null
      ? undefined
      : bestTiers.find(tier => {
          const tokenA = tokens[tokenAIndex].assetAddress;
          const tokenB = tokens[tokenBIndex].assetAddress;
          return (
            (tier.tokenX === tokenA && tier.tokenY === tokenB) ||
            (tier.tokenX === tokenB && tier.tokenY === tokenA)
          );
        })?.bestTierIndex ?? undefined;

  const getMinSliderIndex = () => {
    let minimumSliderIndex = 0;

    for (let index = 0; index < concentrationArray.length; index++) {
      const value = concentrationArray[index];

      const { leftRange, rightRange } = calculateConcentrationRange(
        tickSpacing,
        value,
        2,
        midPrice.index,
        isXtoY
      );

      const { leftInRange, rightInRange } = getTicksInsideRange(leftRange, rightRange, isXtoY);

      if (leftInRange !== leftRange || rightInRange !== rightRange) {
        minimumSliderIndex = index + 1;
      } else {
        break;
      }
    }

    return minimumSliderIndex;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (refresherTime > 0 && poolKey !== '') {
        setRefresherTime(refresherTime - 1);
      } else {
        onRefresh();
        setRefresherTime(REFRESHER_INTERVAL);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [refresherTime, poolKey]);

  useEffect(() => {
    if (positionOpeningMethod === 'concentration') {
      const minimumSliderIndex = getMinSliderIndex();

      setMinimumSliderIndex(minimumSliderIndex);
    }
  }, [poolIndex, positionOpeningMethod, midPrice.index]);

  useEffect(() => {
    if (!ticksLoading && positionOpeningMethod === 'range') {
      onChangeRange(leftRange, rightRange);
    }
  }, [midPrice.index]);

  const handleClickSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    blurContent();
    setSettings(true);
  };

  const handleCloseSettings = () => {
    unblurContent();
    setSettings(false);
  };

  const setSlippage = (slippage: string): void => {
    setSlippTolerance(slippage);
    onSlippageChange(slippage);
  };

  const updatePath = (index1: number | null, index2: number | null, fee: number) => {
    const parsedFee = feeTiers[fee].feeValue;

    if (index1 != null && index2 != null) {
      const token1Symbol = tokens[index1].symbol;
      const token2Symbol = tokens[index2].symbol;
      navigate(`/newPosition/${token1Symbol}/${token2Symbol}/${parsedFee}`, { replace: true });
    } else if (index1 != null) {
      const tokenSymbol = tokens[index1].symbol;
      navigate(`/newPosition/${tokenSymbol}/${parsedFee}`, { replace: true });
    } else if (index2 != null) {
      const tokenSymbol = tokens[index2].symbol;
      navigate(`/newPosition/${tokenSymbol}/${parsedFee}`, { replace: true });
    } else if (fee != null) {
      navigate(`/newPosition/${parsedFee}`, { replace: true });
    }
  };

  return (
    <Grid container className={classes.wrapper} direction='column'>
      <Grid
        className={classes.head}
        container
        direction='row'
        justifyContent='space-between'
        alignContent='center'
        wrap='nowrap'>
        {/* <Link to='/positions' style={{ textDecoration: 'none' }}> */}
        <Grid className={classes.back} container item alignItems='center'>
          <img className={classes.backIcon} src={backIcon} onClick={() => navigate(-1)} />
        </Grid>
        {/* </Link> */}
        <Grid container justifyContent='center'>
          <Typography className={classes.title}>Add new liquidity position</Typography>
        </Grid>
        <Grid container item alignItems='center' className={classes.options}>
          {/* {poolKey !== '' ? (
            <MarketIdLabel
              displayLength={9}
              marketId={poolKey}
              copyPoolAddressHandler={copyPoolAddressHandler}
            />
          ) : null} */}
          {/* <ConcentrationTypeSwitch
            onSwitch={val => {
              if (val) {
                setPositionOpeningMethod('concentration');
                onPositionOpeningMethodChange('concentration');
              } else {
                setPositionOpeningMethod('range');
                onPositionOpeningMethodChange('range');
              }
            }}
            initialValue={initialOpeningPositionMethod === 'concentration' ? 0 : 1}
            className={classes.switch}
            style={{
              opacity: poolKey ? 1 : 0
              // display: poolKey ? 'block' : 'none'
            }}
            disabled={poolKey === ''}
          /> */}
          <Button onClick={handleClickSettings} className={classes.settingsIconBtn} disableRipple>
            <img src={settingIcon} className={classes.settingsIcon} />
          </Button>
        </Grid>
      </Grid>

      <Slippage
        open={settings}
        setSlippage={setSlippage}
        handleClose={handleCloseSettings}
        anchorEl={anchorEl}
        defaultSlippage={'1'}
        initialSlippage={initialSlippage}
        infoText='Slippage tolerance is a pricing difference between the price at the confirmation time and the actual price of the transaction users are willing to accept when initializing position.'
        headerText='Position Transaction Settings'
      />

      <Grid container className={classes.row} alignItems='stretch'>
        {showNoConnected && <NoConnected {...noConnectedBlockerProps} />}
        <DepositSelector
          initialTokenFrom={initialTokenFrom}
          initialTokenTo={initialTokenTo}
          initialFee={initialFee}
          className={classes.deposit}
          tokens={tokens}
          setPositionTokens={(index1, index2, fee) => {
            setTokenAIndex(index1);
            setTokenBIndex(index2);
            onChangePositionTokens(index1, index2, fee);

            updatePath(index1, index2, fee);
          }}
          onAddLiquidity={() => {
            if (tokenAIndex !== null && tokenBIndex !== null) {
              const tokenADecimals = tokens[tokenAIndex].decimals;
              const tokenBDecimals = tokens[tokenBIndex].decimals;
              // console.log({ tokenADeposit, tokenBDeposit, PERCENTAGE_DENOMINATOR });
              addLiquidityHandler(
                leftRange,
                rightRange,
                isXtoY
                  ? convertBalanceToBigint(tokenADeposit, tokenADecimals)
                  : convertBalanceToBigint(tokenBDeposit, tokenBDecimals),
                isXtoY
                  ? convertBalanceToBigint(tokenBDeposit, tokenBDecimals)
                  : convertBalanceToBigint(tokenADeposit, tokenADecimals),
                BigInt(+slippTolerance * Number(PERCENTAGE_DENOMINATOR)) / 100n
              );
            }
          }}
          tokenAInputState={{
            value: tokenADeposit,
            setValue: value => {
              if (tokenAIndex === null) {
                return;
              }

              setTokenADeposit(value);
              setTokenBDeposit(
                getOtherTokenAmount(
                  convertBalanceToBigint(value, tokens[tokenAIndex].decimals),
                  Number(leftRange),
                  Number(rightRange),
                  true
                )
              );
            },
            blocked:
              tokenAIndex !== null &&
              tokenBIndex !== null &&
              !isWaitingForNewPool &&
              determinePositionTokenBlock(
                BigInt(currentPriceSqrt),
                Math.min(Number(leftRange), Number(rightRange)),
                Math.max(Number(leftRange), Number(rightRange)),
                isXtoY
              ) === PositionTokenBlock.A,

            blockerInfo: 'Range only for single-asset deposit.',
            decimalsLimit: tokenAIndex !== null ? Number(tokens[tokenAIndex].decimals) : 0
          }}
          tokenBInputState={{
            value: tokenBDeposit,
            setValue: value => {
              if (tokenBIndex === null) {
                return;
              }
              setTokenBDeposit(value);
              setTokenADeposit(
                getOtherTokenAmount(
                  convertBalanceToBigint(value, Number(tokens[tokenBIndex].decimals)),
                  Number(leftRange),
                  Number(rightRange),
                  false
                )
              );
            },
            blocked:
              tokenAIndex !== null &&
              tokenBIndex !== null &&
              !isWaitingForNewPool &&
              determinePositionTokenBlock(
                BigInt(currentPriceSqrt),
                Math.min(Number(leftRange), Number(rightRange)),
                Math.max(Number(leftRange), Number(rightRange)),
                isXtoY
              ) === PositionTokenBlock.B,
            blockerInfo: 'Range only for single-asset deposit.',
            decimalsLimit: tokenBIndex !== null ? Number(tokens[tokenBIndex].decimals) : 0
          }}
          feeTiers={feeTiers.map(tier => tier.feeValue)}
          progress={progress}
          onReverseTokens={() => {
            if (tokenAIndex === null || tokenBIndex === null) {
              return;
            }

            const pom = tokenAIndex;
            setTokenAIndex(tokenBIndex);
            setTokenBIndex(pom);
            onChangePositionTokens(tokenBIndex, tokenAIndex, currentFeeIndex);

            updatePath(tokenBIndex, tokenAIndex, currentFeeIndex);
          }}
          poolIndex={poolIndex}
          bestTierIndex={bestTierIndex}
          canCreateNewPool={canCreateNewPool}
          canCreateNewPosition={canCreateNewPosition}
          handleAddToken={handleAddToken}
          commonTokens={commonTokens}
          initialHideUnknownTokensValue={initialHideUnknownTokensValue}
          onHideUnknownTokensChange={onHideUnknownTokensChange}
          priceA={tokenAPriceData?.price}
          priceB={tokenBPriceData?.price}
          priceALoading={priceALoading}
          priceBLoading={priceBLoading}
          feeTierIndex={currentFeeIndex}
          concentrationArray={concentrationArray}
          concentrationIndex={concentrationIndex}
          minimumSliderIndex={minimumSliderIndex}
          positionOpeningMethod={positionOpeningMethod}
          // isBalanceLoading={isBalanceLoading}
        />

        {isCurrentPoolExisting ||
        tokenAIndex === null ||
        tokenBIndex === null ||
        tokenAIndex === tokenBIndex ||
        isWaitingForNewPool ? (
          <RangeSelector
            poolIndex={poolIndex}
            onChangeRange={onChangeRange}
            blocked={
              tokenAIndex === null ||
              tokenBIndex === null ||
              tokenAIndex === tokenBIndex ||
              data.length === 0 ||
              isWaitingForNewPool
            }
            blockerInfo={setRangeBlockerInfo()}
            {...(tokenAIndex === null ||
            tokenBIndex === null ||
            !isCurrentPoolExisting ||
            data.length === 0 ||
            isWaitingForNewPool
              ? noRangePlaceholderProps
              : {
                  data,
                  midPrice,
                  tokenASymbol: tokens[tokenAIndex].symbol,
                  tokenBSymbol: tokens[tokenBIndex].symbol
                })}
            ticksLoading={ticksLoading}
            isXtoY={isXtoY}
            tickSpacing={tickSpacing}
            xDecimal={xDecimal}
            yDecimal={yDecimal}
            currentPairReversed={currentPairReversed}
            initialIsDiscreteValue={initialIsDiscreteValue}
            onDiscreteChange={onDiscreteChange}
            positionOpeningMethod={positionOpeningMethod}
            hasTicksError={hasTicksError}
            reloadHandler={reloadHandler}
            concentrationArray={concentrationArray}
            setConcentrationIndex={setConcentrationIndex}
            concentrationIndex={concentrationIndex}
            minimumSliderIndex={minimumSliderIndex}
            getTicksInsideRange={getTicksInsideRange}
          />
        ) : (
          <PoolInit
            onChangeRange={onChangeRange}
            isXtoY={isXtoY}
            tickSpacing={Number(tickSpacing)}
            xDecimal={xDecimal}
            yDecimal={yDecimal}
            tokenASymbol={
              tokenAIndex !== null && tokens[tokenAIndex] ? tokens[tokenAIndex].symbol : 'ABC'
            }
            tokenBSymbol={
              tokenBIndex !== null && tokens[tokenBIndex] ? tokens[tokenBIndex].symbol : 'XYZ'
            }
            midPrice={BigInt(midPrice.index)}
            onChangeMidPrice={onChangeMidPrice}
            currentPairReversed={currentPairReversed}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default NewPosition;
