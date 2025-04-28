import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware';

const UsersManagement = lazy(() => import('@/pages/UsersManagement'));

export const usersRoutes = [
	{
		path: '/users',
		element: (
			<AuthMiddleware requireAuth={true} role="admin">
				<UsersManagement />
			</AuthMiddleware>
		),
	},
];
