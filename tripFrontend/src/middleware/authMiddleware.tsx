import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

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
	const userRole = String(localStorage.getItem('role'));

	// Use React's useEffect for navigation
	useEffect(() => {
		// If the route requires auth but the user is not logged in
		if (requireAuth && !isAuthenticated) {
			navigate(redirectPath ? redirectPath : '/auth/login');
			return;
		}

		// If the user is logged in but tries to access the login/register page
		if (!requireAuth && isAuthenticated) {
			// If the user has a previous URL, redirect back to it
			navigate('/');
			return;
		}

		// Check role if specified
		if (role && role !== userRole) {
			notification.error({
				message: 'Truy cập bị từ chối',
				description: 'Bạn không có quyền truy cập trang này.',
				duration: 3,
			});
			navigate('/');
			return;
		}
	}, [isAuthenticated, navigate, role, userRole]);

	return <>{children}</>;
};
