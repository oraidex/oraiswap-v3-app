import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    width: 1122,

    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  noData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: '16px',
    padding: '60px 20px'
  },
  span: {
    color: '#EFEFEF',
    fontSize: '20px',
    fontWeight: '400',
    marginTop: '-20px'
  }
}));
