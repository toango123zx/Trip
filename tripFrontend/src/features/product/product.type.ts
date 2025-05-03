import { EArrange, TPagination, TProductDetail, TProductSumary } from '@/types';

export type TProductState = {
	products: TProductSumary[];
	pagination: TPagination;
	productDetail: TProductDetail;
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

export type TRequestBodyCreateProduct = {
	name: string;
	posterImageUrl: string;
	time: number;
	quantityAvailable: number;
	age: number;
	description: string;
	locationId: string;
	cityName: string;
	productCategoryId: string;
	locationOnMap: string;
};

export type TSearchAttraction = {
	name?: string;
	minPrice?: number;
	maxPrice?: number;
} & TRequestQueryGetProducts;
