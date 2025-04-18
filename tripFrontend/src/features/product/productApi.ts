import { api, EServer } from '@/lib';
import { TProductSumary } from '@/types';

import { TRequestQueryGetProducts } from './product.type';

export const productApi = {
	async getProducts(query: TRequestQueryGetProducts): Promise<TProductSumary[]> {
		const data = await api.get<TProductSumary[]>('/product', query, EServer.Backend);
		return data;
	},
};
