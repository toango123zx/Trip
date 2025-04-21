import { lazy } from 'react';

import { attractionRoutes } from './attractions';
import { authRoutes } from './authRoutes';
import { userRoutes } from './useRoutes';

const HomePage = lazy(() => import('@/pages/Home'));

const AppRoutes = [
	{
		path: '/',
		element: <HomePage />,
	},
	...authRoutes,
	...userRoutes,
	...attractionRoutes,
];

export default AppRoutes;
