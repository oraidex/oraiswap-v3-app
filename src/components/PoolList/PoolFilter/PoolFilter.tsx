import { Grid } from '@mui/material';
import { default as SearchLightSvg, default as SearchSvg } from '@static/svg/search-svg.svg';
import React from 'react';
import Input, { InputProps } from './Input';
import { useStyles } from './style';

export enum KeyFilterPool {
  all_pool = 'all_pool',
  your_liquidity = 'your_liquidity'
}

type FilterProps = {
  setSearchValue: (val: string) => void;
  searchValue: string;
};

export const PositionsFilter: React.FC<FilterProps> = ({ setSearchValue }) => {
  const { classes } = useStyles();

  return (
    <Grid className={classes.root}>
      <div className={classes.poolFilter}>
        <div className={classes.poolFilterRight}>
          <div className={classes.poolSearch}>
            <Search
              style={null}
              theme={'light'}
              placeholder='Search pools'
              onSearch={value => setSearchValue(value)}
            />
          </div>
        </div>
      </div>
    </Grid>
  );
};

const Search: React.FC<InputProps> = ({ theme, style, ...props }) => {
  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;

  return (
    <Input
      placeholder='Search positions'
      style={{
        paddingLeft: 40,
        backgroundImage: `url(${bgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10px center',
        backgroundColor: '#232521',
        border: 'none',
        outline: 'none',
        minWidth: 'unset',
        ...style
      }}
      {...props}
    />
  );
};
export default Search;
