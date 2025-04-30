import { lazy } from 'react';

const ProductsManagementPage = lazy(() => import('@/pages/ProductsManagement'));

export const productsRoutes = [
	{
		path: '/products',
		element: <ProductsManagementPage />,
	},
];
