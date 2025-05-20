import { createAsyncThunk } from '@reduxjs/toolkit';

import { TCartSummary, TPagination } from '@/types';

import { TRequestQueryGetCarts } from './cart.type';
import { cartApi } from './cartApi';

const getCarts = createAsyncThunk(
	'cart/getCarts',
	async (query?: TRequestQueryGetCarts): Promise<[TCartSummary[], TPagination?]> => {
		const [data, pagination] = await cartApi.getCarts(query);
		return [data, pagination];
	},
);

const deleteCartByCartId = createAsyncThunk(
	'cart/deleteCartByCartId',
	async (cartId: string): Promise<TCartSummary> => {
		const data = await cartApi.deleteCartByCartId(cartId);
		return data;
	},
);

export const cartThunk = {
	getCarts,
	deleteCartByCartId,
};
