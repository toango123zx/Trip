import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware';

const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));

export const authRoutes = [
	{
		path: '/auth/login',
		element: (
			<AuthMiddleware requireAuth={false}>
				<LoginPage />
			</AuthMiddleware>
		),
	},
	{
		path: '/auth/register',
		element: (
			<AuthMiddleware requireAuth={false}>
				<RegisterPage />
			</AuthMiddleware>
		),
	},
];
