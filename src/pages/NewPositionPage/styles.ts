import { theme } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingInline: 138,
      marginTop: 45,
      minHeight: '70vh',

      [theme.breakpoints.down('md')]: {
        paddingInline: 36
      },

      [theme.breakpoints.down('sm')]: {
        paddingInline: 10
      }
    }
  };
});

export default useStyles;
