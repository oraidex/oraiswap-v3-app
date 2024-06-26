import { Theme } from '@mui/material';
import { colors } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      margin: 'auto',
      maxWidth: 1920,
      paddingInline: 94,
      height: 70,

      [theme.breakpoints.down('md')]: {
        paddingInline: 36
      },

      [theme.breakpoints.down('sm')]: {
        paddingInline: 10
      },

      [theme.breakpoints.down('xs')]: {
        paddingInline: 16
      }
    },
    logo: {
      minWidth: 150,
      height: 40
    },
    logoShort: {
      minWidth: 40,
      height: 30,
      marginRight: 8
    },
    routers: {
      padding: 4,
      borderRadius: '99px',
      transition: 'left 300ms',
      width: 'fit-content',
      backgroundColor: '#232521',

      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    rightMenu: {
      backgroundColor: '#232521',
      padding: 4,
      borderRadius: '99px',
      transition: 'all ease-in 300ms',

      '&:hover': {
        // background: 'transparent',
        // boxShadow: '0px 0px 10px #494949',
        // filter: 'brightness(1.25)'
      }
    },

    connectedWalletIcon: {
      minWidth: 21,
      height: 21,
      marginRight: 0,
      color: colors.oraidex.green,
      '& >circle': {
        boxShadow: '0px 0px 10px rgba(157, 212, 109, 0.5)'
      }
    },
    buttons: {
      justifyContent: 'flex-end',
      flex: '1 1 0%',

      [theme.breakpoints.up('lg')]: {
        minWidth: 350
      },

      [theme.breakpoints.only('md')]: {
        minWidth: 350
      },

      [theme.breakpoints.down('lg')]: {
        marginLeft: 0
      },

      [theme.breakpoints.down('lg')]: {
        justifyContent: 'center'
      }
    },
    buttonsLgConnected: {
      [theme.breakpoints.up('lg')]: {
        minWidth: 433
      }
    },
    link: {
      textDecoration: 'none',
      minWidth: 'fit-content',

      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    menu: {
      width: 40,
      height: 25,
      transition: 'filter 300ms'
    },
    menuButton: {
      borderRadius: 10,
      paddingInline: 6,
      paddingBlock: 1,
      height: 45,
      transition: 'background 300ms',
      marginLeft: 8,
      '&:hover': {
        background: 'transparent'
      },
      '&:hover $menu': {
        filter: 'brightness(2)'
      }
    },
    leftSide: {
      flex: '1 1 0%'
    }
  };
});

export default useStyles;
