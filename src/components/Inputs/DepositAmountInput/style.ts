import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme: Theme) => {
  return {
    wrapper: {
      position: 'relative',
      marginBottom: 16,

      [theme.breakpoints.down('sm')]: {
        minWidth: 0
      }
    },
    root: {
      width: '100%',
      backgroundColor: colors.oraidex.componentBcg,
      borderRadius: 20,
      padding: '6px 12px',
      ...typography.heading2
    },
    inputContainer: {
      marginBottom: 6,

      [theme.breakpoints.down('xs')]: {
        marginBottom: 0
      }
    },
    input: {
      color: colors.oraidex.light,
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
      height: 36,
      minWidth: 85,
      width: 'fit-content',
      flexShrink: 0,
      borderRadius: 11,
      backgroundColor: colors.oraidex.light,
      padding: '6px 12px 6px 12px',
      cursor: 'default',

      [theme.breakpoints.down('sm')]: {
        height: 36,
        minWidth: 85
      }
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
    currencyIcon: {
      minWidth: 20,
      height: 20,
      marginRight: 8,
      borderRadius: '100%'
    },
    currencySymbol: {
      ...typography.body3,
      color: colors.white.main
    },
    noCurrencyText: {
      ...typography.body3,
      color: colors.white.main,
      cursor: 'default'
    },
    balance: {
      height: 17,
      cursor: 'pointer',
      flexShrink: 1,
      marginRight: 10
    },
    caption2: {
      ...typography.caption2,
      color: colors.oraidex.lightHover,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',

      '&:hover': {
        color: colors.white.main
      }
    },
    maxButton: {
      color: colors.oraidex.componentBcg,
      ...typography.tiny2,
      borderRadius: 4,
      width: 26,
      minWidth: 26,
      height: 14,
      textTransform: 'none',
      marginLeft: 4,
      background: ' rgba(46, 224, 154, 0.8)',
      lineHeight: '14px',

      '&:hover': {
        background: 'none',
        backgroundColor: colors.oraidex.green,
        boxShadow: '0px 0px 20px -10px white'
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
    noData: {
      color: colors.oraidex.warning,
      ...typography.caption2,
      cursor: 'default',
      display: 'flex',
      flexDirection: 'row'
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
    blocker: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 11,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(11, 12, 13, 0.88)',
      filter: 'blur(4px) brightness(0.4)'
    },
    blockedInfoWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 12,
      height: '100%'
    },
    blockedInfo: {
      ...typography.body2,
      color: colors.oraidex.lightHover
    },
    loading: {
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
    }
  }
})

export default useStyles
