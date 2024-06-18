import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme: Theme) => ({
  wrapperContainer: {
    width: 1004,
    flexDirection: 'row',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  positionDetails: {
    width: 517,
    marginRight: 24,

    [theme.breakpoints.down('md')]: {
      width: '100%'
    },

    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: 32
    }
  },
  right: {
    width: 517,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  back: {
    height: 40,
    marginBottom: 16,
    width: 'fit-content',
    transition: 'filter 300ms',

    '&:hover': {
      filter: 'brightness(2)'
    }
  },
  backIcon: {
    width: 22,
    height: 24,
    marginRight: 12
  },
  backText: {
    color: 'rgba(169, 182, 191, 1)',
    WebkitPaddingBefore: '2px',
    ...typography.body2
  },
  button: {
    color: colors.oraidex.black,
    ...typography.body1,
    textTransform: 'none',
    background: colors.oraidex.pinkLinearGradientOpacity,
    borderRadius: 14,
    height: 40,
    width: 130,
    marginBottom: 16,
    paddingRight: 9,
    paddingLeft: 9,
    letterSpacing: -0.03,

    '&:hover': {
      background: colors.oraidex.pinkLinearGradient,
      boxShadow: `0 0 16px ${colors.oraidex.pink}`
    }
  },
  buttonStartIcon: {
    marginRight: 0
  },
  buttonText: {
    WebkitPaddingBefore: '2px'
  }
}))
