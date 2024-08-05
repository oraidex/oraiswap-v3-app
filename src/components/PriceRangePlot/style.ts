import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    marginTop: 32,
    height: '100%',
    position: 'relative',
    // '& g > text': {
    //   stroke: 'none',
    //   fill: '#A9B6BF!important',
    //   fontFamily: 'IBM Plex Sans!important',

    //   [theme.breakpoints.down('sm')]: {
    //     fontSize: '8px!important'
    //   }
    // }
  },
  zoomIcon: {
    // width: 18,
    // height: 'auto',
    // fill: '#111931',
    // [theme.breakpoints.down('sm')]: {
    //   width: 22
    // }
  },
  zoomButton: {
    minWidth: 28,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: colors.oraidex.border,
    padding: '8px 0',
    '&:not(:last-child)': {
      marginBottom: 4
    },

    '&:hover': {
      backgroundColor: 'transparent',
      opacity: 0.7
      // boxShadow: `0 0 10px ${colors.oraidex.neutralText}`
    },

    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40
    }
  },
  zoomButtonsWrapper: {
    position: 'absolute',
    top: 0,
    right: 8,
    maxWidth: 21,
    height: 64,
    zIndex: 10,
    flexDirection: 'row',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      maxWidth: 92,
      height: 40
    }
  },
  loadingText: {
    fill: colors.oraidex.black,
    ...typography.heading4
  },
  errorWrapper: {
    margin: 'auto'
  },
  errorText: {
    color: colors.white.main,
    ...typography.heading4
  },
  reloadButton: {
    width: 130,
    height: 40,
    borderRadius: 14,
    background: colors.oraidex.greenLinearGradientOpacity,
    color: colors.oraidex.dark,
    ...typography.body1,
    marginTop: 24,
    textTransform: 'none',

    '&:hover': {
      background: colors.oraidex.greenLinearGradient
    }
  },
  cover: {
    width: 'calc(100% + 10px)',
    height: 'calc(100% + 10px)',
    background: '#01051499',
    position: 'absolute',
    zIndex: 11,
    borderRadius: 10,
    backdropFilter: 'blur(16px)'
  },
  loader: {
    height: 100,
    width: 100,
    margin: 'auto'
  }
}));

export default useStyles;
