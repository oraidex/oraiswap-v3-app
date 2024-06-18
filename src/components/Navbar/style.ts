import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    button: {
      minWidth: 67,
      backgroundColor: 'transparent',
      color: colors.oraidex.light,
      height: 32,
      borderRadius: 10,
      ...typography.body1,
      textTransform: 'capitalize',
      boxShadow: 'none',
      margin: '4px',
      '&:hover': {
        background: 'transparent',
        color: colors.oraidex.lightGrey,
        ...typography.body1
      }
    },
    active: {
      background: colors.oraidex.light,
      color: colors.white.main,
      ...typography.body1,
      '&:hover': {
        background: colors.oraidex.light,
        color: colors.white.main
      }
    },
    disabled: {
      opacity: 1
    }
  }
})

export default useStyles
