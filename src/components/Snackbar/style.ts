import { styled } from '@mui/material'
import { colors, typography } from '@static/theme'

import { MaterialDesignContent } from 'notistack'

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: colors.oraidex.component,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.oraidex.component,
    borderRadius: 10,
    ...typography.body2,
    maxWidth: 330,
    width: 330,
    padding: '4px 16px',
    minWidth: 100,

    '& > div:first-of-type': {
      flex: 1
    },

    '& SVG': {
      fontSize: '16px !important',
      color: colors.oraidex.green,
      marginTop: -2,
      [theme.breakpoints.down('xs')]: {
        marginTop: 2
      }
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'none',
      width: 'auto'
    }
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: colors.oraidex.component,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.oraidex.component,
    borderRadius: 10,
    ...typography.body2,
    maxWidth: 330,
    width: 330,
    padding: '4px 16px',
    minWidth: 100,

    '& > div:first-of-type': {
      flex: 1
    },

    '& SVG': {
      fontSize: '16px !important',
      color: colors.oraidex.Error,
      marginTop: -2,
      [theme.breakpoints.down('xs')]: {
        marginTop: 2
      }
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'none',
      width: 'auto'
    }
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: colors.oraidex.component,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.oraidex.component,
    borderRadius: 10,
    ...typography.body2,
    maxWidth: 330,
    width: 330,
    padding: '6px 16px',
    minWidth: 100,

    '& > div:first-of-type': {
      flex: 1
    },

    '& SVG': {
      fontSize: '16px !important',
      color: colors.oraidex.textGrey,
      marginTop: -2,
      [theme.breakpoints.down('xs')]: {
        marginTop: 2
      }
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'none',
      width: 'auto'
    }
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: colors.oraidex.component,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.oraidex.component,
    borderRadius: 10,
    ...typography.body2,
    maxWidth: 330,
    width: 330,
    padding: '6px 16px',
    minWidth: 100,

    '& > div:first-of-type': {
      flex: 1
    },

    '& SVG': {
      fontSize: '16px !important',
      color: colors.oraidex.warning,
      marginTop: -2,
      [theme.breakpoints.down('xs')]: {
        marginTop: 2
      }
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'none',
      width: 'auto'
    }
  }
}))
