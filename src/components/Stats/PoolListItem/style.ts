import { colors, theme, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  container: {
    color: colors.white.main,
    display: 'grid',
    gridTemplateColumns: '5% 45% 15% 20% auto',
    padding: '18px 0',

    backgroundColor: colors.oraidex.component,
    borderBottom: `1px solid ${colors.oraidex.light}`,
    whiteSpace: 'nowrap',
    '& p': {
      ...typography.heading4,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center'
    },

    [theme.breakpoints.down('sm')]: {
      '& p': {
        ...typography.caption1
      }
    },

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '28% 15% 30% 25%'
    }
  },

  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      minWidth: 28,
      maxWidth: 28,
      height: 28,
      marginRight: 3,
      borderRadius: '50%'
    }
  },

  iconsWrapper: {
    height: 28
  },

  header: {
    '& p': {
      color: colors.oraidex.textGrey,
      ...typography.heading4,
      fontWeight: 400,

      [theme.breakpoints.down('sm')]: {
        ...typography.caption2
      }
    }
  },

  symbolsContainer: {
    marginLeft: 10,
    paddingRight: 5,

    '& p': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block'
    },

    [theme.breakpoints.down('xs')]: {
      marginLeft: 0
    }
  },
  icon: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: -4
    }
  },
  activeLiquidityIcon: {
    marginLeft: 5,
    height: 14,
    width: 14,
    border: '1px solid #FFFFFF',
    color: colors.oraidex.text,
    borderRadius: '50%',
    fontSize: 10,
    lineHeight: '10px',
    fontWeight: 400,
    textAlign: 'center',
    boxSizing: 'border-box',
    paddingTop: 1,
    cursor: 'pointer'
  },
  liquidityTooltip: {
    background: colors.oraidex.component,
    boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.35)',
    borderRadius: 20,
    padding: 16,
    maxWidth: 350,
    boxSizing: 'border-box'
  },
  liquidityTitle: {
    color: colors.oraidex.text,
    ...typography.heading4,
    marginBottom: 8
  },
  liquidityDesc: {
    color: colors.oraidex.text,
    ...typography.caption1
  }
}))
