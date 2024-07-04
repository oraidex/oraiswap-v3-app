import { Button as CustomButton } from '@components/Button';
import { EmptyPlaceholder } from '@components/EmptyPlaceholder/EmptyPlaceholder';
import { INoConnected, NoConnected } from '@components/NoConnected/NoConnected';
import loadingAnimation from '@static/gif/loading.gif';
import { PaginationList } from '@components/PaginationList/PaginationList';
import { Button, Grid, InputAdornment, InputBase } from '@mui/material';
import loader from '@static/gif/loader.gif';
import IconRefresh from '@static/svg/ion_refresh.svg';
import SearchIcon from '@static/svg/lupaDark.svg';
import addIcon from '@static/svg/add.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PositionsFilter } from './PoolFilter/PoolFilter';
import { IPositionItem, PositionItem } from './PoolItem/PoolItem';
import { useStyles } from './style';
import { FallbackEmptyData } from '@components/FallbackEmptyData';
import { formatCompactNumber } from '@store/consts/uiUtiils';

interface IProps {
  liquidity: string;
  initialPage: number;
  setLastPage: (page: number) => void;
  data: IPositionItem[];
  onAddPositionClick: () => void;
  loading?: boolean;
  showNoConnected?: boolean;
  noConnectedBlockerProps: INoConnected;
  itemsPerPage: number;
  searchValue: string;
  searchSetValue: (value: string) => void;
  handleRefresh: () => void;
  liquidities: Record<string, number>;
  isLoadingPoolLiquidities: boolean;
}

export const PoolList: React.FC<IProps> = ({
  liquidity,
  initialPage,
  setLastPage,
  data,
  // onAddPositionClick,
  loading = false,
  showNoConnected = false,
  noConnectedBlockerProps,
  itemsPerPage,
  searchValue,
  searchSetValue,
  handleRefresh,
  liquidities,
  isLoadingPoolLiquidities
}) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [defaultPage] = useState(initialPage);
  const [page, setPage] = useState(initialPage);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchSetValue(e.target.value.toLowerCase());
  };

  const handleChangePagination = (page: number): void => {
    setLastPage(page);
    setPage(page);
  };

  const paginator = (currentPage: number) => {
    const page = currentPage || 1;
    const perPage = itemsPerPage || 10;
    const offset = (page - 1) * perPage;
    const paginatedItems = data.slice(offset).slice(0, itemsPerPage);
    const totalPages = Math.ceil(data.length / perPage);

    return {
      page: page,
      totalPages: totalPages,
      data: paginatedItems
    };
  };

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    setPage(initialPage);
  }, []);

  useEffect(() => {
    handleChangePagination(initialPage);
  }, [initialPage]);

  return (
    <>
      <Grid container direction='column' className={classes.root}>
        <Grid
          className={classes.wrapSearch}
          container
          item
          wrap='nowrap'
          direction='row'
          alignItems='center'
          justifyContent={'flex-end'}
          gap={'10px'}
          marginBottom={'24px'}
          // sx={{ display: { xs: 'none', lg: 'flex' } }}
        >
          <PositionsFilter searchValue={searchValue} setSearchValue={searchSetValue} />

          <Button disabled={showNoConnected} onClick={showNoConnected ? () => {} : handleRefresh}>
            <img src={IconRefresh} alt='' />
          </Button>
        </Grid>

        <h1 className={classes.liquidity}>
          Total liquidity:{' '}
          {liquidity == '0' ? (
            <img src={loadingAnimation} style={{ height: 12, width: 12, zIndex: 10 }}></img>
          ) : (
            `$${liquidity}`
          )}{' '}
          {/* {isLoadingPoolLiquidities && <img src={loadingAnimation} style={{ height: 12, width: 12, zIndex: 10 }}></img>} */}
        </h1>
        <Grid container direction='column' className={classes.list} justifyContent='flex-start'>
          {data.length > 0 && !loading ? (
            paginator(page).data.map((element, index) => (
              <Grid
                onClick={() => {
                  // navigate(`/position/${element.address}/${element.id}`);
                  navigate(
                    `/newPosition/${element.tokenXName}/${element.tokenYName}/${element.fee}`
                  );
                }}
                key={element.address + element.id}
                className={classes.itemLink}>
                <PositionItem
                  key={index}
                  {...element}
                  liquidity={liquidities[element.poolAddress]}
                  isLoadingPoolLiquidities={isLoadingPoolLiquidities}
                />
              </Grid>
            ))
          ) : showNoConnected ? (
            <NoConnected {...noConnectedBlockerProps} />
          ) : loading ? (
            <Grid container style={{ flex: 1 }}>
              <img src={loader} className={classes.loading} />
            </Grid>
          ) : (
            <FallbackEmptyData />
          )}
        </Grid>
        {paginator(page).totalPages > 1 ? (
          <PaginationList
            pages={paginator(page).totalPages}
            defaultPage={defaultPage}
            handleChangePage={handleChangePagination}
            variant='end'
          />
        ) : null}
      </Grid>
    </>
  );
};
