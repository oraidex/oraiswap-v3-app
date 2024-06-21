import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles<{ walletDisconnected: boolean }>()(
  (theme: Theme, { walletDisconnected }) => ({
    amountInput: {
      background: colors.oraidex.newDark,
      color: colors.oraidex.light,
      borderRadius: 20,
      ...typography.heading2,
      width: '100%',
      textAlign: 'right',
      transition: 'all .4s',
      '& ::placeholder': {
        textAlign: 'right'
      }
    },
    maxButton: {
      color: colors.oraidex.greenLinearGradient,
      ...typography.body4,
      borderRadius: 4,
      width: 26,
      minWidth: 26,
      height: 14,
      marginLeft: 4,
      fontSize: 12,
      background: 'none !important',
      outline: 'none',
      boxShadow: 'none',

      '&:hover': {
        background: 'none !important',
        // boxShadow: '0px 0px 20px -10px white'
        opacity: 0.7
      },
      [theme.breakpoints.down('sm')]: {
        width: 26,
        minWidth: 26,
        height: 14,
        marginTop: 2
      }
    },
    maxButtonNotActive: {
      backgroundColor: colors.oraidex.light,
      '&:hover': {
        backgroundColor: colors.oraidex.light,
        cursor: 'default'
      }
    },
    select: {
      marginRight: 20
    },
    input: {
      textAlign: 'right',
      color: colors.white.main,
      '& ::placeholder': {
        textAlign: 'right'
      }
    },
    label: {
      top: -1,
      color: colors.oraidex.dark
    },
    balanceContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      paddingBlock: 6,
      flexShrink: 1,
      marginRight: 10
    },
    BalanceTypography: {
      color: colors.oraidex.neutralText,
      ...typography.caption2,
      marginRight: 3,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'flex',
      alignItems: 'center'
    },
    bal: {
      color: colors.oraidex.text
    },
    walletBalanace: {
      color: colors.oraidex.neutralText
    },
    exchangeContainer: {
      padding: `10px 15px ${walletDisconnected ? '10px' : '0'} 15px `,
      display: 'flex'
    },
    noData: {
      color: colors.oraidex.warning,
      ...typography.caption2,
      display: 'flex',
      flexDirection: 'row',
      cursor: 'default',
      paddingBottom: 10
    },
    noDataIcon: {
      marginRight: 5,
      height: 9.5,
      width: 9.5,
      border: '1px solid #EFD063',
      color: colors.oraidex.warning,
      borderRadius: '50%',
      fontSize: 8,
      lineHeight: '10px',
      fontWeight: 400,
      textAlign: 'center',
      alignSelf: 'center',
      cursor: 'default'
    },
    loading: {
      width: 15,
      height: 15
    },
    loadingBalance: {
      padding: '0 10px 0 20px',
      width: 15,
      height: 15
    },
    tooltip: {
      background: colors.oraidex.componentBcg,
      border: `1px solid ${colors.oraidex.lightGrey}`,
      borderRadius: 12,
      padding: 10,
      ...typography.caption4,
      fontSize: 13,
      color: colors.white.main
    },
    percentages: {
      flexShrink: 0,
      width: 'fit-content',
      justifyContent: 'end',
      height: 17
    },
    percentage: {
      ...typography.tiny1,
      borderRadius: 5,
      paddingInline: 5,
      marginRight: 3,
      height: 16,
      lineHeight: '16px',
      display: 'flex',
      flexShrink: 0,
      marginTop: 1
    },
    percentagePositive: {
      color: colors.oraidex.green,
      backgroundColor: `${colors.oraidex.green}40`
    },
    percentageNegative: {
      color: colors.oraidex.Error,
      backgroundColor: `${colors.oraidex.Error}40`
    },
    caption2: {
      ...typography.caption2,
      color: colors.oraidex.neutralText,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '&:hover': {
        color: colors.white.main
      }
    },
    bottom: {
      padding: 12
    }
  })
);
export default useStyles;
