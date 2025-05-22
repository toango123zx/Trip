import React, { JSX } from 'react';

import { BookingCart } from '@/features';
import { MainLayout } from '@/layouts';

const Cart = (): JSX.Element => {
	return (
		<MainLayout>
			<BookingCart />
		</MainLayout>
	);
};

export default Cart;
