import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    headerButton: {
      background: colors.oraidex.light,
      color: colors.white.main,
      paddingInline: 12,
      borderRadius: 10,
      textTransform: 'none',
      ...typography.body1,
      lineHeight: '22px',
      height: 40,

      '&:hover': {
        background: colors.blue.deep
      },
      '&:active': {
        '& #downIcon': {
          transform: 'rotateX(180deg)'
        }
      }
    },
    label: {
      WebkitPaddingBefore: '2px'
    },
    headerButtonConnect: {
      background: colors.oraidex.greenLinearGradientOpacity,
      color: colors.oraidex.newDark,
      paddingInline: 12,
      borderRadius: 10,
      textTransform: 'none',
      ...typography.body1,
      height: 40,
      minWidth: 130,

      [theme.breakpoints.down('xs')]: {
        minWidth: 100,
        width: 130
      },

      '&:hover': {
        boxShadow: `0 0 15px ${colors.oraidex.light}`,
        backgroundColor: colors.oraidex.light
      }
    },
    headerButtonConnected: {
      background: colors.oraidex.light,
      color: colors.white.main,
      paddingInline: 12,
      borderRadius: 10,
      textTransform: 'none',
      ...typography.body1,
      height: 40,

      '&:hover': {
        background: colors.blue.deep
      }
    },
    headerButtonTextEllipsis: {
      textTransform: 'none',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: colors.oraidex.neutralText,
      ...typography.body1,
      whiteSpace: 'nowrap'
    },
    disabled: {
      opacity: 1
    },
    paper: {
      background: 'transparent',
      boxShadow: 'none'
    },
    startIcon: {
      marginLeft: 0,
      marginBottom: 3
    },
    endIcon: {
      minWidth: 20,
      marginTop: 2
    },
    innerEndIcon: {
      marginLeft: 0,
      marginBottom: 3
    }
  };
});

export default useStyles;
