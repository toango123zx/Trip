import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware';

const CartPage = lazy(() => import('@/pages/Cart'));

export const cartsRoutes = [
	{
		path: '/carts',
		element: (
			<AuthMiddleware requireAuth={true}>
				<CartPage />
			</AuthMiddleware>
		),
	},
];
