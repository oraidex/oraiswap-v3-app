import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => {
  return {
    wrapper: {
      borderRadius: 10,
      backgroundColor: colors.oraidex.component,
      padding: '16px 24px 8px 24px',
      flex: '1 1 0%'
    },
    header: {
      ...typography.body1,
      marginBottom: 16,
      color: colors.white.main,
      height: 24
    },
    innerWrapper: {
      borderRadius: 8,
      backgroundColor: colors.oraidex.component,
      width: '100%',
      position: 'relative',
      gap: 4
    },
    topInnerWrapper: {
      minHeight: 253,
      marginBottom: 10
    },
    subheader: {
      ...typography.body1,
      marginBottom: 14,
      color: colors.white.main
    },
    inputs: {
      marginBottom: 16,
      flexDirection: 'row',
      gap: 16
    },
    // input: {
    //   flex: '1 1 0%',
    //   gap: 12,

    //   [theme.breakpoints.down('sm')]: {
    //     '&:first-of-type': {
    //       marginRight: 0,
    //       marginBottom: 8
    //     }
    //   }
    // },

    button: {
      width: '100%',
      flex: '1 1 0%',
      ...typography.body2,
      color: colors.white.main,
      textTransform: 'none',
      height: 36,
      paddingInline: 8,
      backgroundColor: colors.oraidex.light,
      borderRadius: 11,

      [theme.breakpoints.down('sm')]: {
        '&:first-of-type': {
          marginRight: 0,
          marginBottom: 0
        }
      }
    },
    buttons: {
      width: '100%',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center'
    },
    infoWrapper: {
      borderRadius: 8,
      padding: '12px 16px',
      border: '1px solid #E6CF00',
      background: '#383200',
      marginBottom: 16
    },
    info: {
      color: '#E6CF00',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: '18px'
    },
    midPrice: {
      marginBottom: 8
    },
    priceWrapper: {
      backgroundColor: colors.oraidex.light,
      paddingInline: 12,
      paddingBlock: 10,
      borderRadius: 13,
      marginBottom: 18
    },
    priceLabel: {
      ...typography.body2,
      color: colors.oraidex.textGrey
    },
    priceValue: {
      ...typography.body1,
      color: colors.white.main
    },

    inputContainer: {
      marginBottom: 6,
      padding: '12px 16px 12px 12px',
      borderRadius: '8px',
      background: '#232521',
      [theme.breakpoints.down('xs')]: {
        marginBottom: 0
      }
    },
    input: {
      color: colors.oraidex.text,
      ...typography.heading2,
      width: '100%',
      textAlign: 'right',
      transition: 'all .4s',
      '& ::placeholder': {
        textAlign: 'right'
      }
    },
    innerInput: {
      textAlign: 'right',
      color: colors.white.main,
      '& ::placeholder': {
        textAlign: 'right'
      }
    },
    currency: {
      minWidth: 85,
      width: 'fit-content',
      flexShrink: 0,
      cursor: 'default',
      color: '#979995',
      [theme.breakpoints.down('sm')]: {
        height: 36,
        minWidth: 85
      }
    }
  };
});

export default useStyles;
