import { EUserStatus } from './user.type';

export enum ProductStatusEnum {
	active,
	warning,
	waiting,
	inactive,
}

type Supplier = {
	id: string;
	userId: string;
	name: string;
	image: string;
	status: keyof typeof EUserStatus;
};

type ProductImage = [];
type ProductSchedule = [];
type ProductRate = [];

export type TProductSumary = {
	id: string;
	name: string;
	time: number;
	posterImageUrl: string;
	quantityAvailable: number;
	age: number;
	quantityCompleted: number;
	description: string;
	quantityRate: number;
	avgRate: number;
	productCategoryName: string;
	locationName: string;
	city: string;
	price: number;
	supplier: Supplier;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: keyof typeof ProductStatusEnum;
};

export type TProductDetail = {
	id: string;
	name: string;
	time: number;
	posterImageUrl: string;
	quantityAvailable: number;
	age: number;
	quantityCompleted: number;
	despcription: string;
	quantityRate: number;
	avgRate: number;
	productCategoryName: string;
	locationName: string;
	city: string;
	price: number;
	supplier: Supplier;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: keyof typeof ProductStatusEnum;
	productImage: ProductImage;
	productSchedule: ProductSchedule;
	productRate: ProductRate;
};

export type TStat = {
	value: number | string;
	label: string;
};
