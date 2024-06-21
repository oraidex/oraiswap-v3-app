import { Grid, Hidden, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { theme } from '@static/theme';
import { TokenPriceData } from '@store/consts/static';
import { initialXtoY, tickerToAddress } from '@store/consts/uiUtiils';
import {
  FormatNumberThreshold,
  PrefixConfig,
  formatNumbers,
  getCoingeckoTokenPriceV2,
  showPrefix
} from '@store/consts/utils';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useStyles } from './style';

export interface IPositionItem {
  tokenXName: string;
  tokenYName: string;
  tokenXIcon: string;
  tokenYIcon: string;
  tokenXLiq: number;
  tokenYLiq: number;
  fee: number;
  min: number;
  max: number;
  valueX: number;
  valueY: number;
  address: string;
  id: number;
  isActive?: boolean;
  tokenXId?: string;
}

const shorterThresholds: FormatNumberThreshold[] = [
  {
    value: 100,
    decimals: 2
  },
  {
    value: 1000,
    decimals: 1
  },
  {
    value: 10000,
    decimals: 1,
    divider: 1000
  },
  {
    value: 1000000,
    decimals: 0,
    divider: 1000
  },
  {
    value: 10000000,
    decimals: 1,
    divider: 1000000
  },
  {
    value: 1000000000,
    decimals: 0,
    divider: 1000000
  },
  {
    value: 10000000000,
    decimals: 1,
    divider: 1000000000
  }
];

const minMaxShorterThresholds: FormatNumberThreshold[] = [
  {
    value: 10,
    decimals: 3
  },
  ...shorterThresholds
];

const shorterPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 1000
};

export const PositionItem: React.FC<IPositionItem> = ({
  tokenXName,
  tokenYName,
  tokenXIcon,
  tokenYIcon,
  // tokenXLiq,
  // tokenYLiq,
  fee,
  min,
  max,
  valueX,
  valueY,
  isActive = false,
  tokenXId
}) => {
  const { classes } = useStyles();

  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [xToY, setXToY] = useState<boolean>(
    initialXtoY(tickerToAddress(tokenXName), tickerToAddress(tokenYName))
  );

  const [tokenXPriceData, setTokenXPriceData] = useState<TokenPriceData | undefined>(undefined);
  useEffect(() => {
    if (tokenXId) {
      getCoingeckoTokenPriceV2(tokenXId)
        .then(data => setTokenXPriceData(data))
        .catch(() => setTokenXPriceData({ price: 0 }));
    } else {
      setTokenXPriceData(undefined);
    }
  }, [tokenXId]);

  const feeFragment = useMemo(
    () => (
      <Tooltip
        title={
          isActive
            ? 'Position active. Current price is inside range'
            : 'Position inactive. Current price is outside range'
        }
        placement='top'
        classes={{
          tooltip: classes.tooltip
        }}>
        <Grid
          container
          item
          className={classNames(classes.fee, isActive ? classes.activeFee : undefined)}
          justifyContent='center'
          alignItems='center'>
          <Typography
            className={classNames(classes.infoText, isActive ? classes.activeInfoText : undefined)}>
            Fee: {fee}%
          </Typography>
        </Grid>
      </Tooltip>
    ),
    [fee, classes, isActive]
  );

  const valueFragment = useMemo(
    () => (
      <Grid
        container
        item
        className={classes.minMax}
        justifyContent='flex-start'
        direction={'column'}
        alignItems='flex-start'
        wrap='nowrap'>
        <Typography className={classNames(classes.greyText, classes.label)}>Value</Typography>
        <Grid className={classes.infoCenter} container item>
          <Typography className={classes.infoText}>
            $
            {formatNumbers(isXs || isDesktop ? shorterThresholds : undefined)(
              (xToY ? valueX * (tokenXPriceData?.price ?? 0) : valueY).toString()
            )}
            {showPrefix(
              xToY ? valueX : valueY,
              isXs || isDesktop ? shorterPrefixConfig : undefined
            )}{' '}
          </Typography>
        </Grid>
      </Grid>
    ),
    [valueX, valueY, tokenXName, classes, isXs, isDesktop, tokenYName, xToY, tokenXPriceData]
  );

  return (
    <Grid
      className={classes.root}
      container
      direction='row'
      alignItems='center'
      justifyContent='space-between'>
      <Grid container item className={classes.mdTop} direction='row' wrap='nowrap' gap={2}>
        <Grid container item className={classes.iconsAndNames} alignItems='center' wrap='nowrap'>
          <Grid container item className={classes.icons} alignItems='center' wrap='nowrap'>
            <img
              className={classes.tokenIcon}
              src={xToY ? tokenXIcon : tokenYIcon}
              alt={xToY ? tokenXName : tokenYName}
            />
            <img
              className={classes.tokenIcon}
              src={xToY ? tokenYIcon : tokenXIcon}
              alt={xToY ? tokenYName : tokenXName}
            />
          </Grid>

          <Typography className={classes.names}>
            {xToY ? tokenXName : tokenYName} / {xToY ? tokenYName : tokenXName}
          </Typography>
        </Grid>

        <Hidden smDown>{feeFragment}</Hidden>
      </Grid>

      <Grid container item className={classes.mdInfo} direction='row'>
        <Hidden mdUp>{feeFragment}</Hidden>
        <Hidden mdUp>{valueFragment}</Hidden>
        {/* <Grid
          container
          item
          className={classes.minMax}
          justifyContent='flex-start'
          direction={'column'}
          alignItems='flex-start'
          wrap='nowrap'>
          <Typography className={classNames(classes.greyText, classes.label)}>
            Claimable Rewards
          </Typography>
          <Grid className={classes.infoCenter} container item>
            <Typography className={classes.infoText}>$16.21</Typography>
          </Grid>
        </Grid> */}
        <Grid
          container
          item
          className={classes.minMax}
          justifyContent='flex-start'
          direction={'column'}
          alignItems='flex-start'
          wrap='nowrap'>
          <Typography className={classNames(classes.greyText, classes.label)}>Min - Max</Typography>
          <Grid className={classes.infoCenter} container item direction={'row'}>
            <Typography className={classes.infoText}>
              {formatNumbers(isXs || isDesktop ? minMaxShorterThresholds : undefined)(
                (xToY ? min : 1 / max).toString()
              )}
              {showPrefix(
                xToY ? min : 1 / max,
                isXs || isDesktop ? shorterPrefixConfig : undefined
              )}
              {' - '}
              {formatNumbers(isXs || isDesktop ? minMaxShorterThresholds : undefined)(
                (xToY ? max : 1 / min).toString()
              )}
            </Typography>
            <Typography className={classes.suffixText}>
              {showPrefix(
                xToY ? max : 1 / min,
                isXs || isDesktop ? shorterPrefixConfig : undefined
              )}{' '}
              {xToY ? tokenYName : tokenXName} per {xToY ? tokenXName : tokenYName}
            </Typography>
          </Grid>
        </Grid>

        <Hidden smDown>{valueFragment}</Hidden>
      </Grid>
    </Grid>
  );
};
