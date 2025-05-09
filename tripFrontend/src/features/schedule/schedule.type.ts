import { TPagination, TProductSchedule } from '@/types';

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
