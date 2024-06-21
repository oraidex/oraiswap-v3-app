import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    gap: '32px',

    borderRadius: '12px',
    border: '1px solid  #232521',
    background: '#1B1D19',

    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)'
  },

  header: {
    // marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    color: '#F7F7F7',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.5,

    borderBottom: '1px solid #232521'
  },

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
  backWrap: {
    flex: 1
  },
  backIcon: {
    width: 22,
    height: 24,
    marginRight: 12,

    '&:hover': {
      opacity: 0.7
    }
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
    background: colors.oraidex.greenLinearGradientOpacity,
    borderRadius: 14,
    height: 40,
    width: 130,
    marginBottom: 16,
    paddingRight: 9,
    paddingLeft: 9,
    letterSpacing: -0.03,

    '&:hover': {
      background: colors.oraidex.greenLinearGradient,
      boxShadow: `0 0 16px ${colors.oraidex.pink}`
    }
  },
  buttonStartIcon: {
    marginRight: 0
  },
  buttonTextWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  buttonText: {
    width: 'fit-content',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: '8px',
    transition: 'all easy-in-out 0.3s',
    opacity: 1,

    p: {
      textDecoration: 'underline'
    },

    '&:hover': {
      opacity: 0.7
    }
  }
}));
