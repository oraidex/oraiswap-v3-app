import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    background: colors.oraidex.component,
    width: 480,
    borderRadius: 24,
    padding: '20px 24px'
  },
  popover: {
    marginTop: 'calc(50vh - 143px)',
    marginLeft: 'calc(50vw - 241px)',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      marginLeft: 'auto',
      justifyContent: 'center'
    }
  },
  paper: {
    background: 'transparent',
    boxShadow: 'none'
  },
  upperRow: {
    height: 20,
    marginBottom: 16
  },
  title: {
    ...typography.heading4,
    color: colors.oraidex.yellow
  },
  desc: {
    ...typography.body2,
    color: colors.oraidex.text,
    marginBottom: 16
  },
  close: {
    minWidth: 0,
    maxHeight: 20,
    maxWidth: 16,
    fontSize: 20,
    background: 'none',
    '&:hover': {
      background: 'none !important'
    }
  },
  input: {
    backgroundColor: colors.oraidex.newDark,
    width: '100%',
    height: 60,
    color: colors.white.main,
    borderRadius: 20,
    padding: '7px 10px 6px',
    ...typography.heading4,
    fontWeight: 400,
    marginRight: 16,
    '&::placeholder': {
      color: colors.oraidex.light,
      ...typography.heading4,
      fontWeight: 400
    },
    '&:focus': {
      outline: 'none'
    }
  },
  closeButton: {
    height: 44,
    background: colors.oraidex.greenLinearGradientOpacity,
    ...typography.body1,
    color: colors.oraidex.black,
    textTransform: 'none',
    borderRadius: 18,
    marginBottom: 10,

    '&:hover': {
      background: colors.oraidex.greenLinearGradient
    }
  },
  claimButton: {
    height: 44,
    background: colors.oraidex.pinkLinearGradientOpacity,
    ...typography.body1,
    color: colors.oraidex.black,
    textTransform: 'none',
    borderRadius: 18,

    '&:hover': {
      background: colors.oraidex.pinkLinearGradient
    }
  },
  cancelButton: {
    height: 44,
    background: colors.oraidex.light,
    ...typography.body1,
    color: colors.oraidex.black,
    textTransform: 'none',
    borderRadius: 18,
    marginBottom: 10,

    '&:hover': {
      background: colors.oraidex.lightHover
    }
  }
}))

export default useStyles
