import { lazy } from 'react';

const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));

export const authRoutes = [
	{
		path: '/auth/login',
		element: <LoginPage />,
	},
	{
		path: '/auth/register',
		element: <RegisterPage />,
	},
];
