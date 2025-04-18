import { EArrange, TProductDetail, TProductSumary } from '@/types';

export type TProductState = {
	products: TProductSumary[];
	productDetail: TProductDetail | null;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetProducts = {
	page?: number;
	limit?: number;
	name?: EArrange;
	time?: EArrange;
	quantityAvailable?: EArrange;
	age?: EArrange;
	quantityCompleted?: EArrange;
	quantityRate?: EArrange;
	avgRate?: EArrange;
	locationName?: EArrange;
	city?: EArrange;
	productCategoryName?: string;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EArrange;
};
