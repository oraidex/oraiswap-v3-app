import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => {
  return {
    wrapper: {
      width: '100%',
      marginBottom: 8
    },
    bestText: {
      color: colors.oraidex.green,
      position: 'absolute',
      ...typography.caption1,
      textAlign: 'center',
      top: 40
    }
  };
});

export const useTabsStyles = makeStyles()(() => {
  return {
    root: {
      overflow: 'visible',
      height: 36,
      minHeight: 36,
      margin: '4px 4px',
      borderRadius: 99
    },
    indicator: {
      height: 36,
      borderRadius: 99,
      backgroundColor: colors.oraidex.light,
      top: 0
    },
    flexContainer: {
      justifyContent: 'space-between'
    },
    scrollButtons: {
      width: 24,
      '& svg': {
        fill: colors.oraidex.light
      },
      '&:hover svg': {
        fill: colors.oraidex.text
      }
    }
  };
});

export const useSingleTabStyles = makeStyles()(() => {
  return {
    root: {
      zIndex: 1,
      textTransform: 'none',
      ...typography.body3,
      fontSize: 14,
      height: 36,
      minHeight: 36,
      color: colors.oraidex.text,
      paddingInline: 0,
      minWidth: 65,
      width: '32%',
      marginRight: '7px',
      position: 'relative',
      overflow: 'visible',
      borderRadius: 99,
      backgroundColor: '#494949',
      '&:hover': {
        backgroundColor: colors.oraidex.light,
        height: 36,
        border: '1px solid #F7F7F7'
      },

      '&:last-of-type': {
        marginRight: 0
      }
    },
    best: {
      color: colors.oraidex.green,
      border: `2px solid ${colors.oraidex.green}`,

      '&:hover': {
        color: colors.oraidex.green
      }
    },
    selected: {
      color: colors.white.main + ' !important',
      transition: 'color 300ms',
      border: '1px solid #F7F7F7',

      '&:hover': {
        color: colors.white.main
      }
    }
  };
});

export default useStyles;
