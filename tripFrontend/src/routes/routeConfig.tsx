import { lazy } from 'react';

import { attractionRoutes } from './attractions';
import { authRoutes } from './authRoutes';
import { productsRoutes } from './products';
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
];

export default AppRoutes;
