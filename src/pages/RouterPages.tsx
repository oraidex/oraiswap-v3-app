import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ListPage from './ListPage';
import NewPositionPage from './NewPositionPage';
import RootPage from './RootPage';
import SinglePositionPage from './SinglePositionPage';
import StatsPage from './StatsPage';
import SwapPage from './SwapPage';
import ListPool from './ListPool';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootPage />}>
      <Route path='/swap' element={<SwapPage />} />
      <Route path='/positions' element={<ListPage />} />
      <Route path='/pools' element={<ListPool />} />
      <Route path='/status' element={<StatsPage />} />
      <Route path='/newPosition/:item1?/:item2?/:item3?' element={<NewPositionPage />} />
      <Route path='/position/:address/:id' element={<SinglePositionPage />} />
      <Route path='*' element={<Navigate to='/swap' replace />} />
    </Route>
  )
);
