import { actions, PoolStatsData, TimeData, TokenStatsData } from '@store/reducers/stats';
import { all, call, put, select, spawn, takeEvery } from 'typed-redux-saga';
import { tokens } from '@store/selectors/pools';
import { actions as poolsActions } from '@store/reducers/pools';
import { Token, TokenPriceData } from '@store/consts/static';
import {
  getCoingeckoTokenPrices,
  getNetworkStats,
  getPoolsAPY,
  getPoolsFromAdresses,
  getTokenDataByAddresses,
  PoolWithStringKey
} from '@store/consts/utils';

export function* getStats(): Generator {
  try {
    // get pool data snapshoted
    const data = yield* call(getNetworkStats); // pookey -> poolData[]
    // get apy result from data snapshoted
    // const poolsApy = yield* call(getPoolsAPY);

    // console.log({ data, poolsApy })

    // get all pool data aggregated
    const allPoolsData = yield* call(getPoolsFromAdresses, Object.keys(data));

    // transform aggregated pool data to object: poolKey in string -> poolData
    const poolsDataObject: Record<string, PoolWithStringKey> = {};
    allPoolsData.forEach(pool => {
      poolsDataObject[pool.pookKey.toString()] = pool;
    });

    // get all tokens we have
    let allTokens = yield* select(tokens);

    // take unknown tokens from all pools
    const unknownTokens = new Set<string>();
    allPoolsData.forEach(pool => {
      if (!allTokens[pool.tokenX.toString()]) {
        unknownTokens.add(pool.tokenX);
      }

      if (!allTokens[pool.tokenY.toString()]) {
        unknownTokens.add(pool.tokenY);
      }
    });

    // get full data for unknown tokens
    const newTokens = yield* call(getTokenDataByAddresses, [...unknownTokens]);
    yield* put(poolsActions.addTokens(newTokens));

    allTokens = yield* select(tokens);
    // console.log({ allTokens });

    // prepare price for each tokens
    const preparedTokens: Record<string, Required<Token>> = {};
    Object.entries(allTokens).forEach(([key, val]) => {
      if (typeof val.coingeckoId !== 'undefined') {
        preparedTokens[key] = val as Required<Token>;
      }
    });

    // console.log({preparedTokens})

    // get token prices
    let tokensPricesData: Record<string, TokenPriceData> = {};
    tokensPricesData = yield* call(
      getCoingeckoTokenPrices,
      Object.values(preparedTokens).map(token => token.coingeckoId)
    );

    // console.log({ tokensPricesData });

    const volume24 = {
      value: 0,
      change: 0
    };
    const tvl24 = {
      value: 0,
      change: 0
    };
    const fees24 = {
      value: 0,
      change: 0
    };

    const tokensDataObject: Record<string, TokenStatsData> = {};
    let poolsData: PoolStatsData[] = [];

    const volumeForTimestamps: Record<string, number> = {};
    const liquidityForTimestamps: Record<string, number> = {};
    const feesForTimestamps: Record<string, number> = {};

    const lastTimestamp = Math.max(
      ...Object.values(data)
        .filter(snaps => snaps.length > 0)
        .map(snaps => +snaps[snaps.length - 1].timestamp)
    );

    // console.log({ lastTimestamp });
    Object.entries(data).forEach(([address, snapshots]) => {
      console.log('address', address, snapshots.length)
      if (!poolsDataObject[address]) {
        return;
      }

      const tokenXId = preparedTokens?.[poolsDataObject[address].tokenX.toString()]?.coingeckoId ?? '';

      const tokenYId = preparedTokens?.[poolsDataObject[address].tokenY.toString()]?.coingeckoId ?? '';

      if (!tokensDataObject[poolsDataObject[address].tokenX.toString()]) {
        tokensDataObject[poolsDataObject[address].tokenX.toString()] = {
          address: poolsDataObject[address].tokenX,
          price: tokensPricesData?.[tokenXId]?.price ?? 0,
          volume24: 0,
          tvl: 0,
          priceChange: 0
        };
      }

      if (!tokensDataObject[poolsDataObject[address].tokenY.toString()]) {
        tokensDataObject[poolsDataObject[address].tokenY.toString()] = {
          address: poolsDataObject[address].tokenY,
          price: tokensPricesData?.[tokenYId]?.price ?? 0,
          volume24: 0,
          tvl: 0,
          priceChange: 0
        };
      }

      if (!snapshots.length) {
        poolsData.push({
          volume24: 0,
          tvl: 0,
          tokenX: poolsDataObject[address].tokenX,
          tokenY: poolsDataObject[address].tokenY,
          // TODO: hard code decimals
          fee: Number(poolsDataObject[address].fee),
          apy: 0, // TODO: calculate apy
          poolAddress: address
        });
        return;
      }

      const tokenX = allTokens[poolsDataObject[address].tokenX.toString()];
      const tokenY = allTokens[poolsDataObject[address].tokenY.toString()];

      const lastSnapshot = snapshots[snapshots.length - 1];

      console.log('token: ', tokenX.coingeckoId, tokenY.coingeckoId, lastSnapshot, lastTimestamp);

      tokensDataObject[tokenX.address.toString()].volume24 +=
        lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeX.usdValue24 : 0;
      tokensDataObject[tokenY.address.toString()].volume24 +=
        lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeY.usdValue24 : 0;
      tokensDataObject[tokenX.address.toString()].tvl += lastSnapshot.liquidityX.usdValue24;
      tokensDataObject[tokenY.address.toString()].tvl += lastSnapshot.liquidityY.usdValue24;

      poolsData.push({
        volume24:
          lastSnapshot.timestamp === lastTimestamp
            ? lastSnapshot.volumeX.usdValue24 + lastSnapshot.volumeY.usdValue24
            : 0,
        tvl:
          lastSnapshot.timestamp === lastTimestamp
            ? lastSnapshot.liquidityX.usdValue24 + lastSnapshot.liquidityY.usdValue24
            : 0,
        tokenX: poolsDataObject[address].tokenX,
        tokenY: poolsDataObject[address].tokenY,
        fee: Number(poolsDataObject[address].fee),
        apy: 0, // TODO: calculate apy
        poolAddress: address
      });

      snapshots.slice(-30).forEach(snapshot => {
        const timestamp = snapshot.timestamp.toString();

        if (!volumeForTimestamps[timestamp]) {
          volumeForTimestamps[timestamp] = 0;
        }

        if (!liquidityForTimestamps[timestamp]) {
          liquidityForTimestamps[timestamp] = 0;
        }

        if (!feesForTimestamps[timestamp]) {
          feesForTimestamps[timestamp] = 0;
        }

        volumeForTimestamps[timestamp] += snapshot.volumeX.usdValue24 + snapshot.volumeY.usdValue24;
        liquidityForTimestamps[timestamp] +=
          snapshot.liquidityX.usdValue24 + snapshot.liquidityY.usdValue24;
        feesForTimestamps[timestamp] += snapshot.feeX.usdValue24 + snapshot.feeY.usdValue24;
      });
    });

    const volumePlot: TimeData[] = Object.entries(volumeForTimestamps)
      .map(([timestamp, value]) => ({
        timestamp: +timestamp,
        value
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    const liquidityPlot: TimeData[] = Object.entries(liquidityForTimestamps)
      .map(([timestamp, value]) => ({
        timestamp: +timestamp,
        value
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    const feePlot: TimeData[] = Object.entries(feesForTimestamps)
      .map(([timestamp, value]) => ({
        timestamp: +timestamp,
        value
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const tiersToOmit = [0.001, 0.003];

    poolsData = poolsData.filter(pool => !tiersToOmit.includes(pool.fee));

    volume24.value = volumePlot.length ? volumePlot[volumePlot.length - 1].value : 0;
    tvl24.value = liquidityPlot.length ? liquidityPlot[liquidityPlot.length - 1].value : 0;
    fees24.value = feePlot.length ? feePlot[feePlot.length - 1].value : 0;

    const prevVolume24 = volumePlot.length > 1 ? volumePlot[volumePlot.length - 2].value : 0;
    const prevTvl24 = liquidityPlot.length > 1 ? liquidityPlot[liquidityPlot.length - 2].value : 0;
    const prevFees24 = feePlot.length > 1 ? feePlot[feePlot.length - 2].value : 0;

    volume24.change = ((volume24.value - prevVolume24) / prevVolume24) * 100;
    tvl24.change = ((tvl24.value - prevTvl24) / prevTvl24) * 100;
    fees24.change = ((fees24.value - prevFees24) / prevFees24) * 100;

    console.log({
      volume24,
      tvl24,
      fees24,
      tokensData: Object.values(tokensDataObject),
      poolsData,
      volumePlot,
      liquidityPlot
    });

    yield* put(
      actions.setCurrentStats({
        volume24,
        tvl24,
        fees24,
        tokensData: Object.values(tokensDataObject),
        poolsData,
        volumePlot,
        liquidityPlot
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export function* statsHandler(): Generator {
  yield* takeEvery(actions.getCurrentStats, getStats);
}

export function* statsSaga(): Generator {
  yield all([statsHandler].map(spawn));
}
