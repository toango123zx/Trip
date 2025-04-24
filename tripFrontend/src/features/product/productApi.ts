import { api, EServer } from '@/lib';
import { TProductDetail, TProductSumary } from '@/types';

import { TRequestQueryGetProducts } from './product.type';

export const productApi = {
	async getProducts(query?: TRequestQueryGetProducts): Promise<TProductSumary[]> {
		const data = await api.get<TProductSumary[]>('/product', query, EServer.Backend);
		return data;
	},
	async getProductDetail(productId: string): Promise<TProductDetail> {
		const data = await api.get<TProductDetail>(
			`/product/${productId}`,
			{},
			EServer.Backend,
		);
		return data;
	},
};
