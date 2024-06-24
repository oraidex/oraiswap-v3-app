import SinglePositionInfo from '@components/PositionDetails/SinglePositionInfo/SinglePositionInfo';
import SinglePositionPlot from '@components/PositionDetails/SinglePositionPlot/SinglePositionPlot';
import { TickPlotPositionData } from '@components/PriceRangePlot/PriceRangePlot';
import { Grid } from '@mui/material';

import backIcon from '@static/svg/back-arrow.svg';
import { TokenPriceData } from '@store/consts/static';
import { addressToTicker, initialXtoY } from '@store/consts/uiUtiils';
import { PERCENTAGE_SCALE, parseFeeToPathFee, printBigint } from '@store/consts/utils';
import { PlotTickData } from '@store/reducers/positions';
import { VariantType } from 'notistack';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ILiquidityToken } from './SinglePositionInfo/consts';
import { useStyles } from './style';

interface IProps {
  tokenXAddress: string;
  tokenYAddress: string;
  poolAddress: string;
  copyPoolAddressHandler: (message: string, variant: VariantType) => void;
  detailsData: PlotTickData[];
  leftRange: TickPlotPositionData;
  rightRange: TickPlotPositionData;
  midPrice: TickPlotPositionData;
  currentPrice: number;
  tokenX: ILiquidityToken;
  tokenY: ILiquidityToken;
  tokenXPriceData?: TokenPriceData;
  tokenYPriceData?: TokenPriceData;
  onClickClaimFee: () => void;
  closePosition: (claimFarmRewards?: boolean) => void;
  ticksLoading: boolean;
  tickSpacing: number;
  fee: bigint;
  min: number;
  max: number;
  initialIsDiscreteValue: boolean;
  onDiscreteChange: (val: boolean) => void;
  showFeesLoader?: boolean;
  hasTicksError?: boolean;
  reloadHandler: () => void;
  userHasStakes?: boolean;
}

const PositionDetails: React.FC<IProps> = ({
  tokenXAddress,
  tokenYAddress,
  poolAddress,
  copyPoolAddressHandler,
  detailsData,
  leftRange,
  rightRange,
  midPrice,
  currentPrice,
  tokenY,
  tokenX,
  tokenXPriceData,
  tokenYPriceData,
  onClickClaimFee,
  closePosition,
  ticksLoading,
  tickSpacing,
  fee,
  min,
  max,
  initialIsDiscreteValue,
  onDiscreteChange,
  showFeesLoader = false,
  hasTicksError,
  reloadHandler,
  userHasStakes = false
}) => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const [xToY, setXToY] = useState<boolean>(
    initialXtoY(tokenXAddress.toString(), tokenYAddress.toString())
  );

  const navigateAdd = () => {
    const parsedFee = parseFeeToPathFee(fee);
    const address1 = addressToTicker(tokenXAddress.toString());
    const address2 = addressToTicker(tokenYAddress.toString());

    navigate(`/newPosition/${address1}/${address2}/${parsedFee}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Link to='/pool' style={{ textDecoration: 'none' }} className={classes.backWrap}>
          <img className={classes.backIcon} src={backIcon} />
        </Link>

        <span>Liquidity Position Detail</span>

        <div className={classes.buttonTextWrap}>
          <span className={classes.buttonText} onClick={() => navigateAdd()}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='21'
              height='20'
              viewBox='0 0 21 20'
              fill='none'>
              <path
                d='M18.5 10C18.5 10.2767 18.3901 10.5422 18.1944 10.7379C17.9987 10.9335 17.7333 11.0435 17.4565 11.0435H11.5435V16.9565C11.5435 17.2333 11.4335 17.4987 11.2379 17.6944C11.0422 17.8901 10.7767 18 10.5 18C10.2233 18 9.95784 17.8901 9.76215 17.6944C9.56646 17.4987 9.45652 17.2333 9.45652 16.9565V11.0435H3.54348C3.26673 11.0435 3.00132 10.9335 2.80563 10.7379C2.60994 10.5422 2.5 10.2767 2.5 10C2.5 9.72325 2.60994 9.45784 2.80563 9.26215C3.00132 9.06646 3.26673 8.95652 3.54348 8.95652H9.45652V3.04348C9.45652 2.76673 9.56646 2.50132 9.76215 2.30563C9.95784 2.10994 10.2233 2 10.5 2C10.7767 2 11.0422 2.10994 11.2379 2.30563C11.4335 2.50132 11.5435 2.76673 11.5435 3.04348V8.95652H17.4565C17.7333 8.95652 17.9987 9.06646 18.1944 9.26215C18.3901 9.45784 18.5 9.72325 18.5 10Z'
                fill='#F7F7F7'
              />
            </svg>
            <p>Add Liquidity</p>
          </span>
        </div>
      </div>
      <Grid container className={classes.wrapperContainer} wrap='nowrap'>
        <Grid className={classes.positionDetails} container item direction='column'>
          <SinglePositionInfo
            fee={+printBigint(fee, PERCENTAGE_SCALE - 2)}
            onClickClaimFee={onClickClaimFee}
            closePosition={closePosition}
            tokenX={tokenX}
            tokenY={tokenY}
            tokenXPriceData={tokenXPriceData}
            tokenYPriceData={tokenYPriceData}
            xToY={xToY}
            swapHandler={() => setXToY(!xToY)}
            showFeesLoader={showFeesLoader}
            userHasStakes={userHasStakes}
            poolAddress={poolAddress}
            copyPoolAddressHandler={copyPoolAddressHandler}
            navigateAdd={navigateAdd}
          />
        </Grid>

        <Grid
          container
          item
          direction='column'
          alignItems='flex-end'
          className={classes.right}
          wrap='nowrap'>
          <SinglePositionPlot
            data={
              detailsData.length
                ? xToY
                  ? detailsData
                  : detailsData.map(tick => ({ ...tick, x: 1 / tick.x })).reverse()
                : Array(100)
                    .fill(1)
                    .map((_e, index) => ({ x: index, y: index, index }))
            }
            leftRange={xToY ? leftRange : { ...rightRange, x: 1 / rightRange.x }}
            rightRange={xToY ? rightRange : { ...leftRange, x: 1 / leftRange.x }}
            midPrice={{
              ...midPrice,
              x: midPrice.x ** (xToY ? 1 : -1)
            }}
            currentPrice={currentPrice ** (xToY ? 1 : -1)}
            tokenY={tokenY}
            tokenX={tokenX}
            ticksLoading={ticksLoading}
            tickSpacing={tickSpacing}
            min={xToY ? min : 1 / max}
            max={xToY ? max : 1 / min}
            xToY={xToY}
            initialIsDiscreteValue={initialIsDiscreteValue}
            onDiscreteChange={onDiscreteChange}
            hasTicksError={hasTicksError}
            reloadHandler={reloadHandler}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PositionDetails;
