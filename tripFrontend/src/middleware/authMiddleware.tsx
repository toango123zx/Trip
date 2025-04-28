import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthMiddlewareProps = {
	children: React.ReactNode;
	requireAuth?: boolean;
	redirectPath?: string;
	role?: 'admin' | 'supplier' | 'tourist';
};

export const AuthMiddleware = ({
	children,
	requireAuth = true,
	redirectPath,
	role,
}: AuthMiddlewareProps): JSX.Element => {
	const navigate = useNavigate();
	const isAuthenticated = Boolean(localStorage.getItem('logged'));

	// Use React's useEffect for navigation
	useEffect(() => {
		// If the route requires auth but the user is not logged in
		if (requireAuth && !isAuthenticated) {
			navigate(redirectPath ? redirectPath : '/auth/login');
		}

		// If the user is logged in but tries to access the login/register page
		if (!requireAuth && isAuthenticated) {
			// If the user has a previous URL, redirect back to it
			navigate('/');
		}

		if (!role) {
			return;
		}

		if (role !== String(localStorage.getItem('role'))) {
			navigate('/');
		}
		return;
	});

	return <>{children}</>;
};
