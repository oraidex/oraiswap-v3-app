import { PositionsList } from '@components/PositionsList/PositionsList';
import { POSITIONS_PER_PAGE } from '@store/consts/static';
import {
  PERCENTAGE_SCALE,
  calcPrice,
  calcYPerXPriceByTickIndex,
  poolKeyToString,
  printBigint
} from '@store/consts/utils';
import { actions } from '@store/reducers/pools';
import { Status } from '@store/reducers/wallet';
import {
  isLoadingPositionsList,
  lastPageSelector,
  positionsWithPoolsData
} from '@store/selectors/positions';
import { address, status, swapTokens } from '@store/selectors/wallet';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import { openWalletSelectorModal } from '@utils/web3/selector';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSigningClient } from '../../contexts/cosmwasm';
import { PoolList } from '@components/PoolList/PoolList';
import {
  isLoadingAllPool,
  isLoadingLatestPoolsForTransaction,
  liquidityValue,
  poolKeys,
  poolLiquidities,
  pools
} from '@store/selectors/pools';
import { Pool, PoolWithPoolKey } from '@/sdk/OraiswapV3.types';
import { formatCompactNumber } from '@store/consts/uiUtiils';

interface PoolInfo {
  tokenXName: string;
  tokenYName: string;
  tokenXIcon: string;
  tokenYIcon: string;
  fee: number;
  id: number;
  tokenXId: string;
  poolAddress: string;
  currentPrice: number;
  liquidity: string | any;
  address: string;
  token_x: string;
  token_y: string;
  fee_tier: {
    fee: number;
    tick_spacing: number;
  };
}

export const WrappedPoolList: React.FC = () => {
  const walletAddress = useSelector(address);
  const list = useSelector(positionsWithPoolsData);
  const isLoading = useSelector(isLoadingAllPool);
  const lastPage = useSelector(lastPageSelector);
  const listPool = useSelector(pools);
  const listPoolKeys = useSelector(poolKeys);
  const walletStatus = useSelector(status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signingClient } = useSigningClient();
  const tokens = useSelector(swapTokens);
  const liquidity = useSelector(liquidityValue);
  const liquidities = useSelector(poolLiquidities);

  useEffect(() => {
    dispatch(actions.getAllPoolData());
  }, [window.walletType, walletAddress]);

  const [value, setValue] = useState<string>('');

  const handleSearchValue = (value: string) => {
    setValue(value.toLowerCase());
  };

  const setLastPage = (page: number) => {
    dispatch(actions.setLastPoolPage(page));
  };

  useEffect(() => {
    if (list.length === 0) {
      setLastPage(1);
    }

    if (lastPage > Math.ceil(list.length / POSITIONS_PER_PAGE)) {
      setLastPage(lastPage - 1);
    }
  }, [list]);

  const handleRefresh = () => {
    dispatch(actions.getAllPoolData());
    // dispatch(actions.getPoolKeys());
  };

  const data = Object.values(listPool)
    .map(({ pool, pool_key }: PoolWithPoolKey, index) => {
      // const lowerPrice = Number(
      //   calcYPerXPriceByTickIndex(
      //     position.lower_tick_index,
      //     position.tokenX.decimals,
      //     position.tokenY.decimals
      //   )
      // );
      // const upperPrice = calcYPerXPriceByTickIndex(
      //   position.upper_tick_index,
      //   position.tokenX.decimals,
      //   position.tokenY.decimals
      // );

      // const min = Math.min(lowerPrice, upperPrice);
      // const max = Math.max(lowerPrice, upperPrice);

      // let tokenXLiq: any, tokenYLiq: any;

      // const x = 0n;
      // const y = 0n;

      // if (position.poolData) {
      //   // ;[x, y] = calculateTokenAmounts(position.poolData, position)
      // }

      // try {
      //   tokenXLiq = +printBigint(x, position.tokenX.decimals);
      // } catch (error) {
      //   tokenXLiq = 0;
      // }

      // try {
      //   tokenYLiq = +printBigint(y, position.tokenY.decimals);
      // } catch (error) {
      //   tokenYLiq = 0;
      // }

      let temp;
      let tokenX = tokens.find(tk => tk.assetAddress == pool_key.token_x);
      let tokenY = tokens.find(tk => tk.assetAddress == pool_key.token_y);

      if (!tokenY || !tokenX) {
        return {};
      }

      if (tokenX.symbol === 'USDT' || tokenX.symbol === 'USDC') {
        temp = tokenX;
        tokenX = tokenY;
        tokenY = temp;
      }

      const currentPrice = calcPrice(
        pool.current_tick_index ?? 0,
        temp ? false : true,
        tokenX.decimals || 0,
        tokenY.decimals || 0
      );

      return {
        tokenXName: tokenX.symbol,
        tokenYName: tokenY.symbol,
        tokenXIcon: tokenX.logoURI,
        tokenYIcon: tokenY.logoURI,
        fee: +printBigint(BigInt(pool_key.fee_tier.fee), PERCENTAGE_SCALE - 2),

        id: index,
        tokenXId: tokenX.coingeckoId,
        poolAddress: poolKeyToString(pool_key),
        currentPrice,
        liquidity: pool.liquidity,
        address: walletAddress,
        ...pool_key
      };
    })
    .filter((item: PoolInfo) => {
      return (
        item.tokenXName &&
        item.tokenYName &&
        (item.tokenXName.toLowerCase().includes(value) ||
          item.tokenYName.toLowerCase().includes(value))
      );
    })
    .sort((a: PoolInfo, b: PoolInfo) => b.liquidity - a.liquidity);

  return (
    <PoolList
      liquidity={liquidity}
      initialPage={1}
      setLastPage={setLastPage}
      searchValue={value}
      searchSetValue={handleSearchValue}
      handleRefresh={handleRefresh}
      onAddPositionClick={() => {
        navigate('/newPosition');
      }}
      data={data as any}
      loading={isLoading}
      showNoConnected={walletStatus !== Status.Initialized}
      noConnectedBlockerProps={{
        onConnect: openWalletSelectorModal,
        descCustomText: 'No pools.'
      }}
      liquidities={liquidities}
      itemsPerPage={POSITIONS_PER_PAGE}
    />
  );
};

export default WrappedPoolList;
