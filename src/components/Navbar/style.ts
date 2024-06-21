import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
  return {
    button: {
      minWidth: 67,
      backgroundColor: 'transparent',
      color: '#979995',
      height: 32,
      ...typography.body1,
      textTransform: 'capitalize',
      boxShadow: 'none',
      borderRadius: 99,
      fontWeight: 500,
      fontSize: 16,
      '&:hover': {
        // background: '#fff',
        backgroundColor: '#232521',
        color: '#979995',
        ...typography.body1,
        fontWeight: 500,
        fontSize: 16
      }
    },
    active: {
      // background: colors.oraidex.light,
      background: '#fff',
      // color: colors.white.main,
      color: '#292F23',
      ...typography.body1,
      fontWeight: 500,
      fontSize: 16,
      '&:hover': {
        background: '#fff',
        color: '#292F23'
      }
    },
    disabled: {
      opacity: 1
    }
  };
});

export default useStyles;
