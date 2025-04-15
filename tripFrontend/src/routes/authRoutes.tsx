import { lazy } from 'react';

const LoginPage = lazy(() => import('@/pages/Login'));

export const authRoutes = [
	{
		path: '/auth/login',
		element: <LoginPage />,
	},
];
