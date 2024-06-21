import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  iconsGrid: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 35,
    borderRadius: '100%',

    [theme.breakpoints.down('xs')]: {
      width: 22
    }
  },
  icon2: {
    width: 35,
    borderRadius: '100%',
    marginLeft: '-5px',

    [theme.breakpoints.down('xs')]: {
      width: 22
    }
  },
  arrowIcon: {
    width: 22,
    marginRight: 8,
    marginLeft: 8,

    [theme.breakpoints.down('xs')]: {
      width: 15,
      marginRight: 2,
      marginLeft: 2
    }
  },
  text: {
    ...typography.body1,
    color: colors.oraidex.text,
    background: '#494949',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: '4px 8px',
    width: '100%'
  },
  rangeGrid: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  headerButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,

    button: {
      flex: 1
    }
    // [theme.breakpoints.down('xs')]: {
    //   justifyContent: 'space-between',
    //   marginTop: 16
    // }
  },
  feeText: {
    ...typography.body4,
    marginLeft: 12,

    [theme.breakpoints.down('xs')]: {}
  },
  closedText: {
    width: 100,
    paddingRight: 0
  },
  namesGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    '& #pause': {
      padding: ' 0px 3px'
    },

    [theme.breakpoints.down('xs')]: {
      paddingLeft: 4
    }
  },
  name: {
    ...typography.heading5,
    color: colors.oraidex.text,
    lineHeight: '28px',

    [theme.breakpoints.down('xs')]: {
      ...typography.heading4
    }
  },
  bottomGrid: {
    marginTop: 24,
    borderRadius: 24,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  iconSmall: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: '100%'
  },
  boxInfo: {
    borderRadius: 16,
    position: 'relative',
    // '&:not(:last-child)': {
    marginBottom: 24
    // }
  },
  title: {
    ...typography.heading4,
    color: colors.oraidex.text
  },
  titleValue: {
    ...typography.heading3,
    color: colors.oraidex.text,
    fontFamily: 'IBM Plex Sans'
  },
  violetButton: {
    background: colors.oraidex.greenLinearGradientOpacity,
    borderRadius: 99,
    padding: '8px 16px',
    textTransform: 'none',
    color: colors.oraidex.dark,
    ...typography.body1,
    '&:hover': {
      background: colors.oraidex.greenLinearGradient,
      boxShadow: '0px 0px 16px rgba(46, 224, 154, 0.35)'
    },
    '&:disabled': {
      background: colors.oraidex.light,
      color: colors.oraidex.dark
    },

    [theme.breakpoints.down('xs')]: {
      ...typography.body1,
      maxHeight: 28,
      minWidth: 105
    }
  },
  tokenGrid: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    '&:not(:last-child)': {
      paddingTop: 24
    }
  },
  tokenArea: {
    backgroundColor: colors.oraidex.newDark,
    borderRadius: 8,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 12,
    '&:not(:last-child)': {
      marginBottom: 8
    }
  },
  tokenAreaUpperPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tokenAreaLowerPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16
  },
  token: {
    backgroundColor: colors.oraidex.light,
    border: `1px solid`,
    borderColor: colors.oraidex.border,
    borderRadius: 99,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px 13px'
  },
  tokenName: {
    color: colors.white.main,
    ...typography.heading4,
    fontWeight: 400
  },
  tokenValue: {
    color: colors.oraidex.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...typography.heading5,
    fontWeight: 600
  },
  tokenBalance: {
    color: colors.oraidex.neutralText,
    ...typography.caption2
  },
  bal: {
    color: colors.oraidex.neutralTextLight
  },
  tokenUSDValue: {
    color: colors.oraidex.neutralText,
    ...typography.caption2
  },
  closeButton: {
    color: colors.oraidex.text,
    background: colors.oraidex.light,
    border: '1px solid',
    borderColor: colors.oraidex.border,
    padding: '8px 16px',
    // height: 36,
    // width: 116,
    textTransform: 'none',
    transition: '300ms',
    borderRadius: 99,
    ...typography.body1,

    '&:hover': {
      background: colors.oraidex.light,
      // boxShadow: '0px 0px 16px #fff'
      opacity: 0.7
    },
    [theme.breakpoints.down('md')]: {
      marginRight: 10
    },

    [theme.breakpoints.down('xs')]: {
      width: '50%',
      ...typography.caption1,
      height: 40
    }
  },
  button: {
    color: colors.oraidex.black,
    ...typography.body1,
    textTransform: 'none',
    background: colors.oraidex.greenLinearGradientOpacity,
    borderRadius: 12,
    height: 40,
    width: 130,
    paddingRight: 9,
    paddingLeft: 9,
    letterSpacing: -0.03,

    '&:hover': {
      background: colors.oraidex.greenLinearGradient,
      boxShadow: `0 0 16px ${colors.oraidex.pink}`
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
      ...typography.caption1
    }
  },
  buttonText: {
    WebkitPaddingBefore: '2px',
    [theme.breakpoints.down('xs')]: {
      WebkitPaddingBefore: 0
    }
  },
  buttons: {
    width: ' 100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  iconText: {
    paddingRight: 10,
    paddingBottom: 3,
    width: 19,
    height: 19
  },
  arrowsIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 'calc(50% - 8px)',
    left: 'calc(50% - 16px)',
    cursor: 'pointer',

    '&:hover': {
      filter: 'brightness(2)'
    }
  },
  cover: {
    width: '100%',
    height: 'calc(100% - 12px)',
    background: `${colors.oraidex.black}dd`,
    position: 'absolute',
    borderRadius: 10,
    zIndex: 1
  },
  loader: {
    height: 50,
    width: 50,
    margin: 'auto'
  }
}));

export default useStyles;
