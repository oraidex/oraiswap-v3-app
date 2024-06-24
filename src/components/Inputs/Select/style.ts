import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => {
  return {
    button: {
      posiiton: 'relative',
      width: 'auto',
      textTransform: 'none',
      boxShadow: 'none',
      borderRadius: 99,
      minWidth: 'auto',
      backgroundColor: colors.oraidex.light,
      ...typography.heading5,
      padding: '8px 12px 8px 12px',

      filter: 'brightness(1)',

      '&:hover': {
        filter: 'brightness(1)',
        backgroundColor: colors.oraidex.light
      },

      [theme.breakpoints.down('xs')]: {
        minWidth: 'auto'
      }
    },
    tokenName: {
      position: 'relative',
      color: colors.oraidex.text,

      [theme.breakpoints.down('sm')]: {
        fontSize: 16
      }
    },
    icon: {
      marginRight: 8,
      minWidth: 24,
      height: 24,
      borderRadius: '100%'
    },
    endIcon: {
      marginLeft: 9
    }
  };
});

export default useStyles;
