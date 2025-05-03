import { EUserStatus } from './user.type';

type Supplier = {
	id: string;
	userId: string;
	name: string;
	image: string;
	status: keyof typeof EUserStatus;
};

export enum EProductStatus {
	active = 'active',
	warning = 'warning',
	waiting = 'waiting',
	inactive = 'inactive',
}

export enum EProductRate {
	active = 'active',
	removed = 'removed',
}

export enum EProductScheduleStatus {
	active = 'active',
	full = 'full',
	canceled = 'canceled',
}

export type TProductImage = {
	id: string;
	url: string;
};

type TProductSchedule = {
	id: string;
	startTime: string;
	endTime: string;
	price: string;
	booked: string;
	startOrder: string;
	endOrder: string;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EProductScheduleStatus;
};

export type TProductRate = {
	id: string;
	userId: string;
	userName: string;
	userImage: string;
	star: number;
	comment: string;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EProductRate;
};

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
	status: keyof typeof EProductStatus;
};

export type TProductDetail = {
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
	status: EProductStatus;
	productImage: TProductImage[];
	productSchedule: TProductSchedule[];
	productRate: TProductRate[];
};

export type TStat = {
	value: number | string;
	label: string;
};

export type TSchedule = {
	id: string;
	productName: string;
	cityName: string;
	startDate: Date;
	startTime: string;
	endDate: Date;
	endTime: string;
	booked: number;
	price: number;
	status: string;
};
