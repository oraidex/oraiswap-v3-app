import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    background: colors.oraidex.component,
    borderRadius: 16,
    padding: 32,
    flexWrap: 'nowrap',
    border: '1px solid #232521',

    '&:not(:last-child)': {
      marginBottom: 16
    },

    '&:hover': {
      background: `${colors.oraidex.component}B0`
    },

    [theme.breakpoints.down('md')]: {
      padding: 16,
      flexWrap: 'wrap'
    }
  },
  icons: {
    marginRight: 12,
    width: 'fit-content',

    [theme.breakpoints.down('md')]: {
      marginRight: 12
    }
  },
  tokenIcon: {
    width: 32,
    borderRadius: '100%',

    [theme.breakpoints.down('xs')]: {
      width: 28
    },

    '&:last-child': {
      position: 'relative',
      right: '10px'
    }
  },
  names: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    ...typography.heading2,
    color: colors.oraidex.text,
    lineHeight: '40px',
    whiteSpace: 'nowrap',
    fontSize: '18px',

    [theme.breakpoints.down('lg')]: {
      ...typography.heading2
    },
    [theme.breakpoints.down('md')]: {
      lineHeight: '32px',
      width: 'unset'
    },
    [theme.breakpoints.down('sm')]: {
      ...typography.heading3,
      lineHeight: '25px'
    }
  },

  namesRateLiquidity: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    ...typography.heading3,
    color: colors.oraidex.neutralText,
    lineHeight: '40px',
    whiteSpace: 'nowrap',
    fontSize: '18px',

    [theme.breakpoints.down('lg')]: {
      ...typography.heading2
    },
    [theme.breakpoints.down('md')]: {
      lineHeight: '32px',
      width: 'unset'
    },
    [theme.breakpoints.down('sm')]: {
      ...typography.heading5,
      lineHeight: '25px'
    }
  },
  infoText: {
    ...typography.body1,
    fontWeight: 500,
    fontSize: 16,
    color: '#EFEFEF',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',

    [theme.breakpoints.down('xs')]: {
      ...typography.caption1
    }
  },
  suffixText: {
    ...typography.body1,
    fontWeight: 500,
    fontSize: 16,
    marginLeft: 4,
    color: '#979995',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      ...typography.caption1,
      fontWeight: 500
    }
  },
  activeInfoText: {
    // color: colors.oraidex.black
    color: '#EFEFEF',
    fontWeight: 400,
    fontSize: 14
  },
  greenText: {
    ...typography.body1,
    color: colors.oraidex.green,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      ...typography.caption1
    }
  },
  greyText: {
    ...typography.body1,
    color: '#979995',
    fontSize: 14,
    fontWeight: 400,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      ...typography.caption1
    }
  },
  liquidity: {
    background: colors.oraidex.light,
    borderRadius: 11,
    height: 36,
    width: 170,
    marginRight: 8,
    lineHeight: 20,
    [theme.breakpoints.down('md')]: {
      flex: '1 1 0%'
    }
  },
  fee: {
    alignSelf: 'center',
    background: '#494949',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    width: 'fit-content',

    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  activeFee: {
    background: '#494949'
  },
  infoCenter: {
    flex: '1 1 0%',
    alignItems: 'center'
  },
  minMax: {
    borderRadius: 11,
    gap: 4,
    height: 40,
    width: 'fit-content',
    paddingInline: 10,
    marginRight: 8,

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
      marginTop: 8
    }
  },
  mdInfoLiquidity: {
    borderRadius: 11,
    gap: 4,
    height: 40,
    width: 'fit-content',
    paddingInline: 10,
    marginRight: 8,

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
      paddingInline: 0,
      marginTop: 8
    }
  },
  mdInfoRate: {
    borderRadius: 11,
    gap: 4,
    height: 40,
    minWidth: 200,
    width: 'fit-content',
    paddingInline: 10,
    marginRight: 8,

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
      paddingInline: 0,
      marginTop: 8
    }
  },
  value: {
    background: colors.oraidex.light,
    borderRadius: 11,
    height: 36,
    width: 160,
    paddingInline: 12,

    [theme.breakpoints.down('xs')]: {
      width: 144,
      paddingInline: 6
    }
  },
  mdInfo: {
    width: 'fit-content',
    flexWrap: 'nowrap',

    [theme.breakpoints.down('md')]: {
      flexWrap: 'nowrap',
      marginTop: 16,
      width: '100%'
    },

    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  mdTop: {
    width: 'fit-content',
    minWidth: '150px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  iconsAndNames: {
    width: 'fit-content'
  },
  label: {
    marginRight: 2,
    fontSize: 14,
    color: colors.oraidex.neutralTextLight
  },
  liquidityLabel: {
    marginRight: 2,
    fontSize: 14,
    color: colors.oraidex.neutralTextLight,
    textAlign: 'right'
  },
  tooltip: {
    background: colors.oraidex.componentBcg,
    border: `1px solid ${colors.oraidex.lightGrey}`,
    borderRadius: 12,
    padding: 10,
    ...typography.caption4,
    fontSize: 13,
    color: colors.white.main
  }
}));
