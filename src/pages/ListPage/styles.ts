import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#111',
      marginTop: 45,
      paddingInline: 94,
      minHeight: '70vh',

      [theme.breakpoints.down('md')]: {
        paddingInline: 36
      },

      [theme.breakpoints.down('sm')]: {
        paddingInline: 10
      },

      [theme.breakpoints.down('xs')]: {
        paddingInline: 16
      }
    }
  };
});

export default useStyles;
