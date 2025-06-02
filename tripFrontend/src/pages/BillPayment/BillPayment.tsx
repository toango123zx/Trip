import { JSX } from 'react';

import { BillPaymentStatus } from '@/features';
import { MainLayout } from '@/layouts';

const BillPayment = (): JSX.Element => {
  return (
    <MainLayout>
      <BillPaymentStatus />
    </MainLayout>
  );
};

export default BillPayment;
