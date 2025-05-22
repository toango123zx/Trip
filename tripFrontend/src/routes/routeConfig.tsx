import { lazy } from 'react';

import { attractionRoutes } from './attractions';
import { authRoutes } from './authRoutes';
import { cartsRoutes } from './cartsRoutes';
import { productsRoutes } from './productsRoutes';
import { usersRoutes } from './useRoutes';

const HomePage = lazy(() => import('@/pages/Home'));

const AppRoutes = [
	{
		path: '/',
		element: <HomePage />,
	},
	...authRoutes,
	...usersRoutes,
	...attractionRoutes,
	...productsRoutes,
	...cartsRoutes,
];

export default AppRoutes;
