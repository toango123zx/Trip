import { api, EServer } from '@/lib';
import { TPagination, TProductDetail, TProductSumary } from '@/types';

import { TRequestQueryGetProducts } from './product.type';

export const productApi = {
	async getProducts(
		query?: TRequestQueryGetProducts,
	): Promise<[TProductSumary[], TPagination?]> {
		const response = await api.get<TProductSumary[]>(
			'/product',
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},
	async getProductDetail(productId: string): Promise<TProductDetail> {
		const response = await api.get<TProductDetail>(
			`/product/${productId}`,
			{},
			EServer.Backend,
		);
		return response.data;
	},
};
