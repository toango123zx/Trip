import React, { JSX } from 'react';

import { BillList } from '@/features/bill/components';
import { MainLayout } from '@/layouts';

const BillHistory = (): JSX.Element => {
	return (
		<MainLayout>
			<BillList />
		</MainLayout>
	);
};

export default BillHistory;
