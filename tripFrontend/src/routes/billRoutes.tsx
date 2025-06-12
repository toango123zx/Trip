import { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware.tsx';

const BillPage = lazy(() => import('@/pages/Bills'));
const BillHistoryPage = lazy(() => import('@/pages/BillHistory'));
const BillPaymentPage = lazy(() => import('@/pages/BillPayment'));

export const billRoutes = [
	// {
	// 	path: '/bills/payment',
	// 	element: (
	// 		// <AuthMiddleware requireAuth={false}>
	// 		<BillPage />
	// 		// </AuthMiddleware>
	// 	),
	// },
	{
		path: '/bills',
		element: (
			// <AuthMiddleware requireAuth={false}>
			<BillHistoryPage />
			// </AuthMiddleware>
		),
	},
	{
		path: '/bills/payment',
		element: (
		  <AuthMiddleware requireAuth={true}>
			<BillPaymentPage />
		  </AuthMiddleware>
		),
	  },
];
