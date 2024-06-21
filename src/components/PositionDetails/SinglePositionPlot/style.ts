import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    width: '100%',
    padding: 24,
    paddingTop: 18,
    borderRadius: 24
  },
  headerContainer: {
    ...typography.heading4,
    color: '#FFFFFF'
  },
  header: {
    paddingBottom: 10
  },
  plotWrapper: {
    paddingBottom: 29
  },
  minMaxInfo: {
    marginTop: 12,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '15px',
    paddingBottom: 16,

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
      gridGap: '8px'
    }
  },
  currentPriceContainer: {
    backgroundColor: colors.oraidex.black,
    borderRadius: 12,
    padding: 12,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  currentPriceLabel: {
    flex: 1,
    color: colors.oraidex.neutralText,
    textAlign: 'left',

    '& p': {
      ...typography.body4
    }
  },
  currentPriceAmonut: {
    textAlign: 'right',
    borderRadius: '11px!important',
    '& span': {
      color: colors.oraidex.text,
      ...typography.heading5
    },
    '& p': {
      color: colors.oraidex.neutralText,
      ...typography.body4,
      fontSize: 12
    }
  },
  plot: {
    width: '100%',
    height: 255,
    // backgroundColor: colors.oraidex.component,
    borderRadius: 10,

    [theme.breakpoints.down('xs')]: {
      height: 253
    }
  },
  infoRow: {
    marginBottom: 16
  },
  activeLiquidity: {
    color: colors.oraidex.neutralText,
    ...typography.body4,
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'default'
  },
  activeLiquidityIcon: {
    marginLeft: 5,
    height: 14,
    width: 14,
    border: '1px solid',
    borderColor: colors.oraidex.neutralText,
    color: colors.oraidex.neutralText,
    borderRadius: '50%',
    fontSize: 8,
    lineHeight: '10px',
    fontWeight: 400,
    textAlign: 'center',
    boxSizing: 'border-box',
    paddingTop: 3,
    cursor: 'default'
  },
  liquidityTooltip: {
    background: colors.oraidex.component,
    boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.35)',
    borderRadius: 20,
    padding: 16,
    maxWidth: 376,
    boxSizing: 'border-box',

    [theme.breakpoints.down('xs')]: {
      maxWidth: 360
    }
  },
  liquidityTitle: {
    color: colors.oraidex.text,
    ...typography.heading4,
    marginBottom: 12
  },
  liquidityDesc: {
    color: colors.oraidex.text,
    ...typography.caption2
  },
  liquidityNote: {
    color: colors.oraidex.textGrey,
    ...typography.caption2
  },
  liquidityImg: {
    width: 80,
    minWidth: 80,
    height: 60,
    marginLeft: 16
  },
  currentPrice: {
    color: colors.oraidex.yellow,
    ...typography.caption2,
    textAlign: 'right'
  }
}));

export default useStyles;
