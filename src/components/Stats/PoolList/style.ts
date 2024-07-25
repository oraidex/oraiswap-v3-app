import { colors, theme } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    maxWidth: 1072,
    padding: '0 24px',
    borderRadius: '24px',
    backgroundColor: `${colors.oraidex.component} !important`
  },
  pagination: {
    padding: '20px 0 10px 0'
  },
  listWrapper: {
    [theme.breakpoints.down('md')]: {
      overflowX: 'scroll'
    }
  },
  inner: {
    [theme.breakpoints.down('md')]: {
      minWidth: 576
    }
  }
}));
