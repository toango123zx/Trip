import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware';

const AuthMiddlewareWrapper = ({ children, requireAuth }: { children: React.ReactNode, requireAuth: boolean }) => {
	// Implement the authentication logic here
	return <>{children}</>;
};

const UsersManagement = lazy(() => import('@/pages/UsersManagement'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));

export const usersRoutes = [
	{
		path: '/users',
		element: (
			<AuthMiddlewareWrapper requireAuth={true} role="admin">
				<UsersManagement />
			</AuthMiddlewareWrapper>
		),
	},
	{
		path: '/account',
		element: (
			<AuthMiddlewareWrapper requireAuth={true}>
				<AccountPage />
			</AuthMiddlewareWrapper>
		),
	},
];
