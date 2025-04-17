import { FC } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TReduxStoreState } from '@/store/reduxStore';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthMiddleware: FC<AuthMiddlewareProps> = ({ children, requireAuth = false }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: TReduxStoreState) => state.account.isAuthenticated);

// If the route requires auth but the user is not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If the user is logged in but tries to access the login/register page
  if (!requireAuth && isAuthenticated) {
    // If the user has a previous URL, redirect back to it
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}; 