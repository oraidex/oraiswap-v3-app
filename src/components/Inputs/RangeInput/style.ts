import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme: Theme) => ({
  data: {
    height: 36,
    paddingInline: 8,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    backgroundColor: colors.oraidex.light,
    borderRadius: 11,

    [theme.breakpoints.down('sm')]: {
      height: 36
    }
  },
  label: {
    color: colors.white.main,
    whiteSpace: 'nowrap',
    marginRight: 16,
    ...typography.body1,

    [theme.breakpoints.down('sm')]: {
      ...typography.body1
    },
    [theme.breakpoints.down('xs')]: {
      ...typography.caption3
    }
  },
  tokens: {
    color: colors.oraidex.lightHover,
    ...typography.body2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('sm')]: {
      marginInline: 'auto',
      ...typography.body2
    },
    [theme.breakpoints.down('xs')]: {
      ...typography.caption3
    }
  },
  controls: {
    backgroundColor: colors.oraidex.componentBcg,
    borderRadius: 10,
    '& input.Mui-disabled': {
      WebkitTextFillColor: colors.white.main + '!important'
    }
  },
  button: {
    minWidth: 36,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(46,224,154,0.8)',
    padding: 0,
    zIndex: 1,

    '&:hover': {
      backgroundColor: colors.oraidex.green,
      boxShadow: `0 0 10px ${colors.oraidex.green}`
    },

    [theme.breakpoints.down('sm')]: {
      minWidth: 40,
      width: 40,
      height: 40
    }
  },
  buttonIcon: {
    width: 22,
    height: 'auto',
    fill: colors.oraidex.dark
  },
  value: {
    color: colors.white.main,
    ...typography.body3,
    lineHeight: 24,
    backgroundColor: colors.oraidex.componentBcg,
    height: 36,
    paddingInline: 5,
    borderRadius: 10,
    flex: '1 1 0%',

    '& input': {
      textAlign: 'center'
    },

    '& input:disabled': {
      color: colors.white.main
    },

    [theme.breakpoints.down('sm')]: {
      height: 36
    },
    [theme.breakpoints.down('xs')]: {
      ...typography.caption2
    }
  },
  diffWrapper: {
    borderRadius: 11,
    height: 36,
    backgroundColor: colors.oraidex.black
  },
  diffLabelWrapper: {
    borderRadius: 11,
    height: 36,
    backgroundColor: colors.oraidex.light,
    display: 'flex',
    alignItems: 'center',
    paddingInline: 10
  },
  diffLabel: {
    ...typography.caption2,
    color: colors.oraidex.text,
    width: 'fit-content',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  diff: {
    ...typography.body1,
    padding: 3,
    borderRadius: 5,
    marginInline: 'auto',
    flex: '0 0 auto'
  }
}))

export default useStyles
