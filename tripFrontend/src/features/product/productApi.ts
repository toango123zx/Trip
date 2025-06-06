import { api, EServer } from '@/lib';
import { TPagination, TProductDetail, TProductSumary } from '@/types';

import {
	TRequestBodyCreateProduct,
	TRequestBodyUpdateProduct,
	TRequestQueryGetProducts,
} from './product.type';

export const productApi = {
	async getProducts(
		query?: TRequestQueryGetProducts,
	): Promise<[TProductSumary[], TPagination?]> {
		try {
			const safeQuery = query || {};
			const response = await api.get<TProductSumary[]>(
				'/product?time=asc&statusSearch=active',
				{
					...safeQuery,
					page: safeQuery.page || 1,
					limit: safeQuery.limit || 6
				},
				EServer.Backend,
			);

			return [response.data, response.pagination];
		} catch (error) {
			console.error('Lỗi khi gọi API getProducts:', error);
			throw error;
		}
	},
	async getProductsManagement(
		query?: TRequestQueryGetProducts,
	): Promise<[TProductSumary[], TPagination?]> {
		const response = await api.get<TProductSumary[]>(
			'/product/management',
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

	async createProduct(product: TRequestBodyCreateProduct): Promise<TProductDetail> {
		const data = await api.post<TProductDetail, TRequestBodyCreateProduct>(
			'/product',
			product,
			{},
			EServer.Backend,
		);
		return data;
	},

	async updateProductByProductId(
		productId: string,
		product: TRequestBodyUpdateProduct,
	): Promise<TProductDetail> {
		const data = await api.put<TProductDetail, TRequestBodyUpdateProduct>(
			`/product/${productId}`,
			product,
		);
		return data;
	},

	async deleteProductByProductId(productId: string): Promise<TProductDetail> {
		const data = await api.delete<TProductDetail>(`/product/${productId}`);
		return data;
	},
};
