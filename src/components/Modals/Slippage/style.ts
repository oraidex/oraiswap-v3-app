import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => {
  return {
    popover: {
      marginTop: 'calc(50vh - 350px)',
      marginLeft: 'calc(50vw - 251px)'
      // [theme.breakpoints.down('xs')]: {
      //   display: 'flex',
      //   marginLeft: 'auto',
      //   justifyContent: 'center'
      // }
    },
    paper: {
      background: 'none',
      backgroundColor: 'transparent',
      '& > *': {
        backgroundColor: 'transparent'
      }
    },
    detailsWrapper: {
      width: '100%',
      maxWidth: 500,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.oraidex.component,
      padding: 16,
      borderRadius: 12,
      color: colors.white.main,
      '& h2': {
        ...typography.heading4,
        paddingBottom: 10
      }
    },

    label: {
      ...typography.body2,
      color: colors.oraidex.text,
      marginBottom: 16,
      marginTop: 12
    },

    selectTokenClose: {
      minWidth: 0,
      background: 'none',
      '&:hover': {
        background: 'none !important'
      },
      cursor: 'pointer',
      '&:after': {
        content: '"\u2715"',
        fontSize: 20,
        position: 'absolute',
        color: colors.white.main,
        top: '40%',
        right: '10%',
        transform: 'translateY(-50%)'
      }
    },
    detailsInfoForm: {
      border: `1px solid ${colors.oraidex.component}`,
      color: colors.oraidex.text,
      borderRadius: 15,
      width: '100%',
      backgroundColor: colors.oraidex.newDark,
      ...typography.heading4,
      fontWeight: 400,
      padding: 16,
      '&::placeholder': {
        color: colors.oraidex.light
      },
      '&:focus': {
        outline: 'none'
      }
    },
    innerInput: {
      paddingBlock: 0
    },
    detailsInfoBtn: {
      backgroundColor: colors.oraidex.greenLinearGradient,
      borderRadius: 99,
      border: 'none',
      padding: '6px 16px',
      // width: 49,
      // height: 28,
      cursor: 'pointer',
      ...typography.body2,
      fontWeight: 500,
      '&:hover': {
        filter: 'brightness(1.15)',
        transition: ' .4s filter',
        boxShadow:
          '0px 3px 1px -2px rgba(43, 193, 144, 0.2),0px 1px 2px 0px rgba(45, 168, 128, 0.14),0px 0px 5px 7px rgba(59, 183, 142, 0.12)'
      }
    },
    info: {
      ...typography.caption2,
      color: colors.oraidex.neutralText,
      marginTop: 24,
      textAlign: 'justify'
    }
  };
});

export default useStyles;
