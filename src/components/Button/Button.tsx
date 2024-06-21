import React from 'react';
import useStyles from './style';

type ButtonType =
  | 'primary'
  | 'secondary'
  | 'primary-sm'
  | 'secondary-sm'
  | 'disable-sm'
  | 'third'
  | 'third-sm'
  | 'error'
  | 'error-sm';

interface Props {
  type: ButtonType;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactElement | React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactElement | React.ReactNode;
  style?: React.CSSProperties;
}

export const Button: React.FC<Props> = ({ children, onClick, type, icon, style, ...rest }) => {
  const { classes } = useStyles();

  return (
    <button
      onClick={event => onClick(event)}
      className={`${classes.button} ${classes[type]}`}
      style={style}
      {...rest}>
      {icon && <span className={classes.icon}>{icon}</span>}
      {children}
    </button>
  );
};
