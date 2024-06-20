import { Grid } from '@mui/material';
import React, { useState } from 'react';
import classNames from 'classnames';
import SearchSvg from 'assets/images/search-svg.svg';
import SearchLightSvg from 'assets/images/search-light-svg.svg';
import Input, { InputProps } from './Input';
import { useStyles } from './style';

export enum KeyFilterPool {
  all_pool = 'all_pool',
  your_liquidity = 'your_liquidity'
}

const LIST_FILTER_POOL = [
  {
    key: KeyFilterPool.all_pool,
    text: 'All Pools'
  },
  {
    key: KeyFilterPool.your_liquidity,
    text: 'Your Liquidity'
  }
];

// type FilterProps = {
//   setFilteredPools: React.Dispatch<React.SetStateAction<PoolInfoResponse[]>>;
//   setIsOpenNewTokenModal: (status: boolean) => void;
//   pools: PoolInfoResponse[];
// };

export const PositionsFilter: React.FC<{ FilterProps }> = () => {
  const { classes } = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  return (
    <Grid>
      <div className={classes.poolFilter}>
        <div className={classes.poolFilterList}>
          {LIST_FILTER_POOL.map(item => (
            <div
              key={item.key}
              className={classNames(
                item.key === typeFilter ? classes.filterActive : null,
                classes.filterItem
              )}
              onClick={() => setTypeFilter(item.key)}>
              {item.text}
            </div>
          ))}
        </div>
        <div className={classes.poolFilterRight}>
          <div className={classes.poolSearch}>
            <Search
              style={null}
              theme={'light'}
              placeholder='Search by address, asset, type'
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
      placeholder='Search by pools or tokens name'
      style={{
        paddingLeft: 40,
        backgroundImage: `url(${bgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10px center',
        ...style
      }}
      {...props}
    />
  );
};
export default Search;
