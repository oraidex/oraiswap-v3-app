import debounce from 'lodash/debounce';
import React from 'react';

export type InputProps = {
  placeholder: string;
  onSearch?: (text: string) => void;
  isBorder?: boolean;
  theme?: string;
  style: any;
};

const Input: React.FC<InputProps> = ({ onSearch, ...props }) => (
  <input
    onChange={debounce(e => {
      onSearch?.(e.target.value);
    }, 500)}
    {...props}
  />
);

export default Input;
