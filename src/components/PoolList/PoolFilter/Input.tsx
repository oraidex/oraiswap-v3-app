import debounce from 'lodash/debounce';
import React from 'react';
import { useStyles } from './style';

export type InputProps = {
  placeholder: string;
  onSearch?: (text: string) => void;
  isBorder?: boolean;
  theme?: string;
  style: any;
};

const Input: React.FC<InputProps> = ({ onSearch, ...props }) => {
  const { classes } = useStyles();

  return (
    <input
      className={classes.input}
      onChange={debounce(e => {
        onSearch?.(e.target.value);
      }, 500)}
      {...props}
    />
  );
};

export default Input;
