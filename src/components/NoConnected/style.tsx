import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  container: {
    width: '100%',
    height: '370px',
    position: 'absolute',
    zIndex: 14
  },
  root: {
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
    width: '100%',
    height: '100%'
  },
  img: {
    paddingBottom: 25
  },
  blur: {
    width: '100%',
    height: '370px',
    backgroundColor: 'rgba(12, 11, 13, 0.8)',
    position: 'absolute',
    zIndex: 13,
    borderRadius: 10
  },
  desc: {
    ...typography.body2,
    fontWeight: 500,
    lineHeight: '20px',
    color: colors.oraidex.lightHover
  },
  button: {
    height: 40,
    width: 200,
    marginTop: 20,
    color: colors.oraidex.componentBcg,
    ...typography.body1,
    textTransform: 'none',
    borderRadius: 14,
    background: colors.oraidex.pinkLinearGradientOpacity,

    '&:hover': {
      background: colors.oraidex.pinkLinearGradient,
      boxShadow: '0px 0px 16px rgba(239, 132, 245, 0.35)'
    }
  }
}))
