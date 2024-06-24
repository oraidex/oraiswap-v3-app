import ClosePositionWarning from '@components/Modals/ClosePositionWarning/ClosePositionWarning';
import { Button, Grid, Typography } from '@mui/material';
import { TokenPriceData } from '@store/consts/static';
import { blurContent, unblurContent } from '@utils/uiUtils';
import classNames from 'classnames';
import React, { useState } from 'react';
import { BoxInfo } from './BoxInfo';
import { ILiquidityToken } from './consts';
import useStyles from './style';
import MarketIdLabel from '@components/NewPosition/MarketIdLabel/MarketIdLabel';
import { VariantType } from 'notistack';
import { parseFeeToPathFee } from '@store/consts/utils';
import { addressToTicker } from '@store/consts/uiUtiils';
import { useNavigate } from 'react-router-dom';

interface IProp {
  fee: number;
  onClickClaimFee: () => void;
  closePosition: (claimFarmRewards?: boolean) => void;
  tokenX: ILiquidityToken;
  tokenY: ILiquidityToken;
  tokenXPriceData?: TokenPriceData;
  tokenYPriceData?: TokenPriceData;
  xToY: boolean;
  swapHandler: () => void;
  showFeesLoader?: boolean;
  userHasStakes?: boolean;
  poolAddress: string;
  copyPoolAddressHandler: (message: string, variant: VariantType) => void;
  navigateAdd?: () => void;
}

const SinglePositionInfo: React.FC<IProp> = ({
  fee,
  onClickClaimFee,
  closePosition,
  tokenX,
  tokenY,
  tokenXPriceData,
  tokenYPriceData,
  xToY,
  swapHandler,
  showFeesLoader = false,
  userHasStakes = false,
  poolAddress,
  copyPoolAddressHandler,
  navigateAdd
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const tokenA = xToY
    ? { ...tokenX, value: tokenX.claimValue }
    : { ...tokenY, value: tokenY.claimValue };

  const tokenB = xToY
    ? { ...tokenY, value: tokenY.claimValue }
    : { ...tokenX, value: tokenX.claimValue };

  const disableClaimFee =
    Math.abs(Number(tokenA.value)) < 10 ** Number(-tokenA.decimal) &&
    Math.abs(Number(tokenB.value)) < 10 ** Number(-tokenB.decimal);

  return (
    <Grid className={classes.root}>
      <ClosePositionWarning
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          unblurContent();
        }}
        onClose={() => {
          closePosition();
          setIsModalOpen(false);
          unblurContent();
        }}
        onClaim={() => {
          closePosition(true);
          setIsModalOpen(false);
          unblurContent();
        }}
      />
      <Grid className={classes.header}>
        <Grid className={classes.iconsGrid}>
          <img
            className={classes.icon}
            src={xToY ? tokenX.icon : tokenY.icon}
            alt={xToY ? tokenX.name : tokenY.name}
          />
          <img
            className={classes.icon2}
            src={xToY ? tokenY.icon : tokenX.icon}
            alt={xToY ? tokenY.name : tokenX.name}
          />
          <Grid className={classes.namesGrid}>
            <Typography className={classes.name}>{xToY ? tokenX.name : tokenY.name}</Typography>
            <Typography id='pause' className={classes.name}>
              /
            </Typography>
            <Typography className={classes.name}>{xToY ? tokenY.name : tokenX.name}</Typography>
          </Grid>
          <Grid className={classes.rangeGrid}>
            <Typography className={classNames(classes.text, classes.feeText)}>
              Fee: {fee.toString()}%
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid className={classes.headerButtons}>
          <Button
            className={classes.closeButton}
            variant='contained'
            onClick={() => {
              if (!userHasStakes) {
                closePosition();
              } else {
                setIsModalOpen(true);
                blurContent();
              }
            }}>
            Close position
          </Button>
        </Grid> */}
      </Grid>
      <MarketIdLabel
        marketId={poolAddress.toString()}
        displayLength={9}
        copyPoolAddressHandler={copyPoolAddressHandler}
      />
      <Grid className={classes.bottomGrid}>
        <BoxInfo
          title={'Liquidity'}
          tokenA={
            xToY
              ? { ...tokenX, value: tokenX.liqValue, price: tokenXPriceData?.price }
              : { ...tokenY, value: tokenY.liqValue, price: tokenYPriceData?.price }
          }
          tokenB={
            xToY
              ? { ...tokenY, value: tokenY.liqValue, price: tokenYPriceData?.price }
              : { ...tokenX, value: tokenX.liqValue, price: tokenXPriceData?.price }
          }
          showBalance
          swapHandler={swapHandler}
        />
        <BoxInfo
          title={'Unclaimed fees'}
          tokenA={
            xToY ? { ...tokenX, value: tokenX.claimValue } : { ...tokenY, value: tokenY.claimValue }
          }
          tokenB={
            xToY ? { ...tokenY, value: tokenY.claimValue } : { ...tokenX, value: tokenX.claimValue }
          }
          onClickButton={onClickClaimFee}
          showLoader={showFeesLoader}
        />
      </Grid>

      <Grid className={classes.headerButtons}>
        <Button
          className={classes.closeButton}
          variant='contained'
          onClick={() => {
            if (!userHasStakes) {
              closePosition();
            } else {
              setIsModalOpen(true);
              blurContent();
            }
          }}>
          Close Position
        </Button>
        <Button
          className={classes.violetButton}
          variant='contained'
          onClick={onClickClaimFee}
          disabled={disableClaimFee}>
          Claim Fee
        </Button>
      </Grid>
      <div className={classes.btnMobile}>
        <Button
          className={classes.closeButton}
          variant='contained'
          onClick={() => {
            if (!userHasStakes) {
              closePosition();
            } else {
              setIsModalOpen(true);
              blurContent();
            }
          }}>
          Close Position
        </Button>
        <Button
          className={classes.violetButton}
          variant='contained'
          onClick={onClickClaimFee}
          disabled={disableClaimFee}>
          Claim Fee
        </Button>
        <span className={classes.buttonTextMb} onClick={() => navigateAdd && navigateAdd()}>
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
    </Grid>
  );
};

export default SinglePositionInfo;
