import { lazy } from 'react';

import SignInForm from '@/features/auth/SignInPage';

const LoginPage = lazy(() => import('@/pages/SignIn'));

export const authRoutes = [
	{
		path: '/auth/sign-in',
		element: <SignInForm />,
	},
	{
		path: '/auth/register',
		element: <LoginPage />,
	},
];
