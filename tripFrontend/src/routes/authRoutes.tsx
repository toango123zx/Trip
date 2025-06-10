import { lazy } from 'react';

// Create a wrapper component for AuthMiddleware
const AuthMiddlewareWrapper = ({ children, requireAuth }: { children: React.ReactNode, requireAuth: boolean }) => {
	// Implement the authentication logic here
	return <>{children}</>;
};

const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));

export const authRoutes = [
	{
		path: '/auth/login',
		element: (
			<AuthMiddlewareWrapper requireAuth={false}>
				<LoginPage />
			</AuthMiddlewareWrapper>
		),
	},
	{
		path: '/auth/register',
		element: (
			<AuthMiddlewareWrapper requireAuth={false}>
				<RegisterPage />
			</AuthMiddlewareWrapper>
		),
	},
];
