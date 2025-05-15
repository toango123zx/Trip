import {
	EProductScheduleStatus,
	EProductStatus,
	TPagination,
	TProductSchedule,
} from '@/types';

export type TScheduleState = {
	schedules: TProductSchedule[];
	scheduleDetail: TProductSchedule;
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestBodyCreateSchedule = {
	id: string;
	price: number;
	startTime: Date;
	endTime: Date;
	startOrder: Date;
	endOrder: Date;
};

export type TReSponseBodyScheduleDetail = {
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
	product: {
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
