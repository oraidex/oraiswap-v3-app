import { Theme } from '@mui/material';
import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((_theme: Theme) => ({
  infoTypeLabel: {
    // textTransform: 'uppercase',
    color: colors.oraidex.neutralText,
    ...typography.body4
  },

  infoSwap: {
    textAlign: 'right'
  },
  infoTypeSwap: {
    display: 'flex',
    backgroundColor: colors.oraidex.newDark,
    borderRadius: 12,
    padding: 12,

    lineHeight: '20px',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoType: {
    borderRadius: 12,
    textAlign: 'left',
    marginRight: 6
  },
  infoAmount: {
    textAlign: 'right',
    color: colors.oraidex.text,
    ...typography.heading5

    // [theme.breakpoints.only('md')]: {
    //   ...typography.body2,
    //   lineHeight: '35px'
    // }
  },
  infoSwapToken: {
    textAlign: 'right',
    color: colors.oraidex.lightGrey,
    ...typography.body4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));

export default useStyles;
