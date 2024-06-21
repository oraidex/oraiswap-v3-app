import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      margin: 'auto',
      maxWidth: 1920,
      paddingInline: 150,
      height: 70,

      [theme.breakpoints.down('lg')]: {
        paddingInline: 32
      },

      [theme.breakpoints.down('md')]: {
        paddingInline: 24
      },

      [theme.breakpoints.down('xs')]: {
        paddingInline: 16
      }
    },

    button: {
      fontWeight: '600',
      fontSize: '16px',
      borderRadius: '30px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      gap: 4,
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed'
      }
    },

    icon: {
      marginRight: '5px',
      width: '20px',
      height: '20px'
    },

    primary: {
      backgroundColor: '#aee67f',
      color: '#1e300a',
      border: '1px',
      padding: '11.5px 30px',
      borderRadius: '99px'
    }
  };
});

export default useStyles;
