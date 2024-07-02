import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    width: 1122,

    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  wrapSearch: {
    marginTop: '-100px',
    paddingBottom: 32,

    [theme.breakpoints.down('md')]: {
      marginTop: '0',
      paddingBottom: 0
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'flex-start'
    }
  },
  header: {
    paddingBottom: 16,
    display: 'flex',
    alignItems: 'flex-end'
  },
  titleBar: {
    display: 'flex',
    marginBottom: 20
  },
  title: {
    color: colors.oraidex.text,
    ...typography.heading4,
    fontWeight: 500
  },
  positionsNumber: {
    width: 28,
    height: 28,
    color: colors.oraidex.text,
    background: colors.oraidex.light,
    marginLeft: 8,
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchRoot: {
    width: '100%'
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  searchBar: {
    width: 221,
    height: 32,
    padding: '7px 12px',
    borderRadius: 10,
    background: colors.oraidex.black,
    border: '1px solid #202946',
    color: colors.oraidex.lightGrey,
    ...typography.body2,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 200
    }
  },
  button: {
    color: colors.oraidex.dark,
    ...typography.body1,
    textTransform: 'none',
    borderRadius: 14,
    height: 40,
    minWidth: 130,
    paddingInline: 0,
    marginLeft: 16,
    background:
      'linear-gradient(180deg, rgba(239, 132, 245, 0.8) 0%, rgba(156, 62, 189, 0.8) 100%)',

    '&:hover': {
      background: 'linear-gradient(180deg, #EF84F5 0%, #9C3EBD 100%)',
      boxShadow: '0px 0px 16px rgba(239, 132, 245, 0.35)'
    }
  },

  buttonSelectDisabled: {
    ...typography.body1,
    textTransform: 'none',
    borderRadius: 14,
    height: 40,
    minWidth: 130,
    paddingInline: 0,
    cursor: 'auto',
    marginLeft: 16,
    background: `${colors.oraidex.light} !important`,

    '&:hover': {
      filter: 'brightness(1.15)'
    }
  },
  buttonText: {
    WebkitPaddingBefore: '2px'
  },
  noPositionsText: {
    ...typography.heading1,
    textAlign: 'center',
    color: colors.oraidex.text
  },
  list: {
    position: 'relative',
    flex: 1
  },
  itemLink: {
    textDecoration: 'none',
    cursor: 'pointer',

    '&:not(:last-child)': {
      display: 'block',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 16
      }
    }
  },
  searchIcon: {
    width: 17
  },
  loading: {
    width: 150,
    height: 150,
    margin: 'auto'
  },
  placeholder: {
    margin: 'auto'
  },
  refreshIconBtn: {
    padding: 0,
    margin: 0,
    minWidth: 'auto',
    background: 'none',
    marginRight: 7,
    '&:hover': {
      background: 'none'
    },
    '&:disabled': {
      opacity: 0.5
    }
  },
  refreshIcon: {
    width: 26,
    height: 21,
    cursor: 'pointer',
    transition: 'filter 100ms',
    '&:hover': {
      filter: 'brightness(1.5)'
    }
  },
  liquidity: {
    color: colors.oraidex.text,
    ...typography.heading4,
    fontWeight: 500,
  },
}));
