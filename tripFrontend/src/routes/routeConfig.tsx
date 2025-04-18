import { lazy } from 'react';

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
];

export default AppRoutes;
