import { EProductScheduleStatus, EProductStatus } from './product.type';
import { EUserStatus } from './user.type';

export enum EDiscountStatus {
	active = 'active',
	full = 'full',
	canceled = 'canceled',
}

export enum EInfoDiscountStatus {
	active = 'active',
	inactive = 'inactive',
	pendingAdd = 'pending add',
	pendingRemove = 'pending remove',
}

export type TDiscountSumary = {
	id: string;
	name: string;
	productName: string;
	code: string;
	description: string;
	discountPercent: number;
	startTime: string;
	endTime: string;
	quantity: number;
	value: number;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EDiscountStatus;
};

export type TDiscountDetail = {
	id: string;
	name: string;
	user: {
		id: string;
		name: string;
	};
	code: string;
	description: string;
	startTime: Date;
	endTime: Date;
	value: number;
	quantity: number;
	point: number;
	applited: number;
	stackable: boolean;
	discountType: {
		id: string;
		name: string;
	};
	discountEligibility: {
		id: string;
		name: string;
	};
	discountApplicationScope: {
		id: string;
		name: string;
	};
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EDiscountStatus;
};

export type TDiscount = {
	id: string;
	name: string;
	discountProviderType: string;
	userId: string;
	code: string;
	description: string;
	startTime: Date;
	endTime: Date;
	value: number;
	quantity: number;
	point: number;
	applited: number;
	stackable: boolean;
	discountType: {
		id: string;
		name: string;
	};
	discountEligibility: {
		id: string;
		name: string;
	};
	discountApplicationScope: {
		id: string;
		name: string;
	};
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: string;
	user: {
		id: string;
		name: string;
		image: string;
		email: string;
		phoneNumber: string | null;
	};
	infoDiscount: Array<{
		id: string;
		discountId: string;
		productScheduleId: string;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date | null;
		status: EDiscountStatus;
		productSchedule: {
			id: string;
			productId: string;
			productName: string;
			productPosterImageUrl: string;
			productTime: number;
			productRate: number;
			productAge: number;
			startTime: Date;
			endTime: Date;
			price: number;
			booked: number;
			startOrder: string;
			endOrder: string;
			createAt: Date;
			updateAt: Date;
			deletedAt: Date | null;
			status: EProductScheduleStatus;
			supplier: {
				id: string;
				userId: string;
				name: string;
				image: string;
				email: string;
				phoneNumber: string | null;
				status: EUserStatus;
			};
		};
	}>;
};
export type TDiscountsNonDiscountable = {
	id: string;
	productId: string;
	startTime: Date;
	endTime: Date;
	price: number;
	booked: number;
	startOrder: Date;
	endOrder: Date;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EProductScheduleStatus;
	product?: {
		id: string;
		name: string;
		posterImageUrl: string;
		supplierId: string;
		time: number;
		quantityAvailable: number;
		age: number;
		quantityCompleted: number;
		description: string;
		quantityRate: number;
		avgRate: number;
		locationId: string;
		productCategoryId: string;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date | null;
		status: EProductStatus;
	};
};
