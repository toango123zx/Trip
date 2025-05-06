import { JSX } from 'react';

import { ProductList } from '@/features';
import { MainLayout } from '@/layouts';

const ProductsManagement = (): JSX.Element => {
	return (
		<MainLayout>
			<ProductList />
		</MainLayout>
	);
};

export default ProductsManagement;
