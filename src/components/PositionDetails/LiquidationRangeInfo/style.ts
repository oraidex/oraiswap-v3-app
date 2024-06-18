import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme: Theme) => ({
  infoTypeLabel: {
    textTransform: 'uppercase',
    color: colors.oraidex.lightGrey,
    ...typography.body2,
    lineHeight: '35px',
    [theme.breakpoints.down('md')]: {
      ...typography.caption4,
      lineHeight: '35px'
    },
    [theme.breakpoints.down('sm')]: {
      ...typography.body2,
      lineHeight: '35px'
    }
  },
  infoTypeSwap: {
    display: 'flex',
    backgroundColor: colors.oraidex.dark,
    borderRadius: 13,
    lineHeight: '20px',
    alignItems: 'center'
  },
  infoType: {
    backgroundColor: colors.oraidex.light,
    borderRadius: 13,
    textAlign: 'center',
    marginRight: 6,
    width: 61,
    padding: 2,
    [theme.breakpoints.down('md')]: {
      marginRight: 0
    }
  },
  infoSwap: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 16,
    width: '100%'
  },
  infoAmount: {
    color: colors.oraidex.text,
    paddingRight: 8,
    ...typography.body1,
    lineHeight: '35px',

    [theme.breakpoints.only('md')]: {
      ...typography.body2,
      lineHeight: '35px'
    }
  },
  infoSwapToken: {
    color: colors.oraidex.lightGrey,
    ...typography.body1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '35px',
    [theme.breakpoints.down('md')]: {
      ...typography.caption3,
      lineHeight: '35px'
    },
    [theme.breakpoints.down('sm')]: {
      ...typography.caption1,
      lineHeight: '35px'
    }
  }
}))

export default useStyles
