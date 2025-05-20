import { api } from '@/lib';
import { TCartSummary, TPagination } from '@/types';

import { TRequestQueryGetCarts } from './cart.type';

export const cartApi = {
	async getCarts(
		query?: TRequestQueryGetCarts,
	): Promise<[TCartSummary[], TPagination?]> {
		const response = await api.get<TCartSummary[]>('/cart', query);
		return [response.data, response.pagination];
	},

	async deleteCartByCartId(cartId: string): Promise<TCartSummary> {
		const data = await api.delete<TCartSummary>(`/cart/${cartId}`);
		return data;
	},
};
