import { lazy } from 'react';

import { attractionRoutes } from './attractions';
import { authRoutes } from './authRoutes';
import { billRoutes } from './billRoutes';
import { cartsRoutes } from './cartsRoutes';
import { productsRoutes } from './productsRoutes';
import { usersRoutes } from './useRoutes';

const HomePage = lazy(() => import('@/pages/Home'));
const SalesPage = lazy(() => import('@/pages/SalesPage'));

const AppRoutes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sales',
    element: <SalesPage />,
  },
  ...authRoutes,
  ...usersRoutes,
  ...attractionRoutes,
  ...productsRoutes,
  ...cartsRoutes,
  ...billRoutes,
];

export default AppRoutes;
