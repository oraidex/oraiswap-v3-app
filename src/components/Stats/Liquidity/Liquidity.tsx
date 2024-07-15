import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import classNames from 'classnames';
import { colors } from '@static/theme';
import { useStyles } from './style';
import { TimeData } from '@store/reducers/stats';
import { Grid, Typography } from '@mui/material';
import { formatNumbers, showPrefix } from '@store/consts/utils';

interface LiquidityInterface {
  liquidityPercent: number;
  liquidityVolume: number;
  data: TimeData[];
  className?: string;
}

const Liquidity: React.FC<LiquidityInterface> = ({
  liquidityPercent,
  liquidityVolume,
  data,
  className
}) => {
  const { classes } = useStyles();

  const isLower = liquidityPercent < 0;

  return (
    <Grid className={classNames(classes.container, className)}>
      <Grid className={classes.liquidityContainer}>
        <Typography className={classes.liquidityHeader}>Liquidity</Typography>
        <Grid className={classes.volumePercentHeader}>
          <Typography className={classes.volumeLiquidityHeader}>
            ${formatNumbers()(liquidityVolume.toString())}
            {showPrefix(liquidityVolume)}
          </Typography>
          <Grid className={classes.volumeStatusContainer}>
            <Grid
              className={classNames(
                classes.volumeStatusColor,
                isLower ? classes.backgroundVolumeLow : classes.backgroundVolumeUp
              )}>
              <Typography
                component='p'
                className={classNames(
                  classes.volumeStatusHeader,
                  isLower ? classes.volumeLow : classes.volumeUp
                )}>
                {liquidityPercent < 0 ? liquidityPercent.toFixed(2) : `+${liquidityPercent.toFixed(2)}`}%
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.barContainer}>
        <ResponsiveLine
          data={[
            {
              id: 'liquidity',
              data: data.map(({ timestamp, value }) => ({
                x: new Date(timestamp).toLocaleDateString('en-GB'),
                y: value
              }))
            }
          ]}
          margin={{ top: 24, bottom: 24, left: 24, right: 24 }}
          xScale={{
            type: 'time',
            format: '%d/%m/%Y',
            precision: 'day',
            useUTC: false
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            tickValues:
              data.length >= 24 ? 'every 4 days' : data.length >= 8 ? 'every 2 days' : 'every day',
            format: '%d/%m'
          }}
          legends={[]}
          axisTop={null}
          axisRight={null}
          axisLeft={null}
          curve={'monotoneX'}
          role='aplication'
          enableGridX={false}
          enableGridY={false}
          enablePoints={false}
          enableArea={true}
          isInteractive
          useMesh
          animate
          colors={colors.oraidex.green}
          theme={{
            axis: {
              ticks: {
                line: { stroke: colors.oraidex.component },
                text: { fill: '#A9B6BF' }
              }
            },
            crosshair: {
              line: {
                stroke: colors.oraidex.lightGrey,
                strokeWidth: 1,
                strokeDasharray: 'solid'
              }
            }
          }}
          lineWidth={1}
          defs={[
            linearGradientDef('gradient', [
              { offset: 0, color: 'inherit' },
              { offset: 50, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 }
            ])
          ]}
          fill={[{ match: '*', id: 'gradient' }]}
          crosshairType='bottom'
          tooltip={({ point }) => {
            const date = point.data.x as Date;
            const day = date.getDate();
            const month = date.getMonth() + 1;

            return (
              <Grid className={classes.tooltip}>
                <Typography className={classes.tooltipDate}>{`${day < 10 ? '0' : ''}${day}/${
                  month < 10 ? '0' : ''
                }${month}`}</Typography>
                <Typography className={classes.tooltipValue}>
                  ${(point.data.y as number).toFixed(2)}
                </Typography>
              </Grid>
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Liquidity;
