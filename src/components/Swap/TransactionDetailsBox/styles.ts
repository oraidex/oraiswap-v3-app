import { colors, typography } from '@static/theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles<{ open: boolean }>()((_theme, { open }) => ({
  wrapper: {
    padding: 0,
    overflow: 'hidden',
    transition: 'max-height 300ms',
    maxHeight: open ? 160 : 0,
    marginBottom: 16
  },
  innerWrapper: {},
  row: {
    marginTop: 8
  },
  label: {
    ...typography.caption2,
    color: colors.oraidex.neutralText,
    lineHeight: '21px',
    marginRight: 3
  },
  value: {
    ...typography.caption2,
    lineHeight: '21px',
    color: colors.oraidex.text
  },
  loadingContainer: {
    width: 20,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  loading: {
    width: 15,
    height: 15
  }
}));
