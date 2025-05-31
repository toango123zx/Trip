import React, { lazy } from 'react';

import { AuthMiddleware } from '@/middleware/authMiddleware.tsx';

const BillPaymentPage = lazy(() => import('@/pages/BillPayment'));

export const billRoutes = [
  {
    path: '/bills/payment',
    element: (
      <AuthMiddleware requireAuth={true}>
        <BillPaymentPage />
      </AuthMiddleware>
    ),
  },
];
