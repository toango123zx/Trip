import {
	EArrange,
	EProductStatus,
	TPagination,
	TProductDetail,
	TProductSumary,
} from '@/types';

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
	keyword?: string;
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
	statusSearch?: EProductStatus;
	status?: EArrange;
	priceFromSearch?: number;
	priceToSearch?: number;
	startTimeSearch?: string;
	endTimeSearch?: string;
	citySearch?: string;
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
	productImageUrls?: string[];
	urlMap?: string;
};

export type TRequestBodyUpdateProduct = {
	name: string;
	posterImageUrl: string;
	time: number;
	quantityAvailable: number;
	age: number;
	description: string;
	productImageUrls?: string[];
};

export type TSearchAttraction = {
	name?: string;
	minPrice?: number;
	maxPrice?: number;
} & TRequestQueryGetProducts;
