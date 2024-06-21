import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  '@keyframes slide-down': {
    '0%': {
      transform: 'translateY(0%)'
    },
    '50%': {
      transform: 'translateY(60%)'
    },
    '100%': {
      transform: 'translateY(0%)'
    }
  },
  '@keyframes slide-up': {
    '0%': {
      transform: 'translateY(0%)'
    },
    '50%': {
      transform: 'translateY(-70%)'
    },
    '100%': {
      transform: 'translateY(0%)'
    }
  },

  '@keyframes slide-down-xs': {
    '0%': {
      transform: 'translateY(0%)'
    },
    '50%': {
      transform: 'translateY(90%)'
    },
    '100%': {
      transform: 'translateY(0%)'
    }
  },
  '@keyframes slide-up-xs': {
    '0%': {
      transform: 'translateY(0%)'
    },
    '50%': {
      transform: 'translateY(-110%)'
    },
    '100%': {
      transform: 'translateY(0%)'
    }
  },
  swapWrapper: {
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('xs')]: {
      padding: '0 16px'
    }
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 500,
    position: 'relative',
    paddingBottom: 24,
    '& h1': {
      ...typography.heading4,
      color: colors.white.main
    }
  },
  headerLeft: {
    flex: 1,
    visibility: 'hidden'
  },
  refreshIcon: {
    width: 26,
    height: 21,
    cursor: 'pointer',
    transition: 'filter 100ms',
    '&:hover': {
      filter: 'brightness(1.5)'
    }
  },
  settingsIcon: {
    width: 20,
    height: 20,
    cursor: 'pointer',
    transition: 'filter 100ms',
    '&:hover': {
      filter: 'brightness(1.5)'
    }
  },
  divider: {
    width: '100%',
    borderBottom: '1px solid',
    borderColor: colors.oraidex.newDark
  },
  HiddenTransactionButton: {
    paddingInline: 0,
    width: '100%',
    background: 'none !important',
    border: 'none',
    minWidth: 'auto',
    color: colors.oraidex.lightHover,

    '&:hover': {
      filter: 'brightness(1.15)',
      cursor: 'pointer'
    }
  },

  transactionDetailDisabled: {
    width: '100%',
    background: 'none !important',
    border: 'none',
    minWidth: 'auto',
    color: colors.oraidex.lightHover
  },

  swapControls: {
    display: 'flex',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end'
  },

  refreshIconBtn: {
    padding: 0,
    margin: 0,
    minWidth: 'auto',
    background: 'none',
    '&:hover': {
      background: 'none'
    },
    '&:disabled': {
      opacity: 0.5
    }
  },
  settingsIconBtn: {
    padding: 0,
    margin: 0,
    minWidth: 'auto',
    background: 'none',
    '&:hover': {
      background: 'none'
    }
  },
  slippage: {
    position: 'absolute'
  },
  root: {
    background: '#1B1D19',
    borderRadius: 12,
    paddingInline: 24,
    paddingBottom: 22,
    paddingTop: 16,
    width: 500,
    border: '1px solid #232521',
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)'
  },

  connectWalletButton: {
    height: '48px !important',
    borderRadius: '16px !important',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important'
    }
  },
  tokenComponentTextContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  amountInput: {
    position: 'relative'
  },
  amountInputDown: {
    animation: '$slide-down 300ms linear',

    [theme.breakpoints.down('xs')]: {
      animation: '$slide-down-xs 300ms linear'
    }
  },

  amountInputUp: {
    animation: '$slide-up 300ms linear',

    [theme.breakpoints.down('xs')]: {
      animation: '$slide-up-xs 300ms linear'
    }
  },

  swapArrowBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.oraidex.component,
    width: 50,
    height: 50,
    borderRadius: '50%',
    position: 'absolute',
    zIndex: 2,
    left: '50%',
    top: '0%',
    transform: 'translateX(-50%) translateY(-40%)',
    cursor: 'pointer',
    transition: 'background-color 200ms',

    [theme.breakpoints.down('xs')]: {
      transform: 'translateX(-50%) translateY(-14%)'
    }
  },
  swapImgRoot: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    '&:hover': {
      // backgroundColor: colors.oraidex.light
      opacity: 0.7
    }
  },

  swapArrows: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    marginBlock: 13,
    marginInline: 6,
    transition: '.4s all'
  },

  transactionDetails: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexFlow: 'row nowrap',
    marginTop: 5,
    position: 'relative',
    cursor: 'default',
    filter: 'brightness(0.9)'
  },
  transactionDetailsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    margin: '16px 0 8px 0',
    borderRadius: '10px',
    alignItems: 'center',

    justifyContent: 'space-between'
  },

  transactionDetailsHeader: {
    ...typography.heading5,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    color: colors.oraidex.text,
    fontSize: 17,

    [theme.breakpoints.down('xs')]: {
      ...typography.caption2
    }
  },

  swapButton: {
    width: '100%',
    height: 48
  },

  exchangeRoot: {
    marginTop: 24,
    position: 'relative',
    background: colors.oraidex.newDark,
    borderRadius: 8
  },
  transactionTop: {
    marginTop: 10
  },

  hideBalance: {
    padding: '5px 15px 5px 15px'
  },

  transactionBottom: {
    marginTop: 10,

    [theme.breakpoints.down('xs')]: {
      marginTop: 36
    }
  },

  transtactionData: {
    border: `1px solid ${colors.oraidex.light}`,
    borderRadius: '10px',
    padding: '5px 15px 5px 15px',
    color: colors.oraidex.lightGrey
  },

  buttonSelectDisabled: {
    background: `${colors.oraidex.greenLinearGradient} !important`,

    '&:hover': {
      filter: 'brightness(1.15)',
      boxShadow:
        '0px 3px 1px -2px rgba(43, 193, 144, 0.2),0px 1px 2px 0px rgba(45, 168, 128, 0.14),0px 0px 5px 7px rgba(59, 183, 142, 0.12)'
    }
  },
  ButtonSwapActive: {
    transition: 'filter 0.3s linear',
    background: `${colors.oraidex.greenLinearGradient} !important`,
    filter: 'brightness(0.8)',
    '&:hover': {
      filter: 'brightness(1.15)',
      boxShadow:
        '0px 3px 1px -2px rgba(43, 193, 144, 0.2),0px 1px 2px 0px rgba(45, 168, 128, 0.14),0px 0px 5px 7px rgba(59, 183, 142, 0.12)'
    }
  },
  infoIcon: {
    width: 10,
    height: 10,
    marginLeft: 4,
    marginBottom: 2,
    filter: 'brightness(0.8)',
    pointerEvents: 'none'
  }
}));

export default useStyles;
