import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware';

const UsersManagement = lazy(() => import('@/pages/UsersManagement'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));

export const usersRoutes = [
	{
		path: '/users',
		element: (
			<AuthMiddleware requireAuth={true} role="admin">
				<UsersManagement />
			</AuthMiddleware>
		),
	},
	{
		path: '/account',
		element: (
			<AuthMiddleware requireAuth={true}>
				<AccountPage />
			</AuthMiddleware>
		),
	},
];
