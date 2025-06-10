import React, { JSX } from 'react';

import { PaymentCheckout } from '@/features/bill/components/BillCheck/BillCheck';
import { MainLayout } from '@/layouts';

const Bills = (): JSX.Element => {
	return (
		<MainLayout>
			<PaymentCheckout />
		</MainLayout>
	);
};

export default Bills;
