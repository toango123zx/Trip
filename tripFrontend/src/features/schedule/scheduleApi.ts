import { api, EServer } from '@/lib';
import { EProductScheduleStatus, TCartSummary, TProductSchedule } from '@/types';

import { TRequestBodyCreateSchedule, TReSponseBodyScheduleDetail } from './schedule.type';

export const scheduleApi = {
	async getSchedules(query?: { page?: number; limit?: number }): Promise<{ data: TProductSchedule[]; pagination: { totalItems: number; itemsPerPage: number; currentPage: number; totalPages: number } }> {
		const response = await api.get<{ data: TProductSchedule[]; pagination: { totalItems: number; itemsPerPage: number; currentPage: number; totalPages: number } }>(
			'/schedule?createAt=desc',
			query,
			EServer.Backend,
		);
		return response;
	},

	async getScheduleByScheduleId(
		scheduleId: string,
		status: EProductScheduleStatus,
	): Promise<TReSponseBodyScheduleDetail> {
		const data = await api.get<TReSponseBodyScheduleDetail>(
			`/schedule/${scheduleId}`,
			{
				status: status,
			},
			EServer.Backend,
		);
		return data.data;
	},

	async createSchedule(
		productId: string,
		schedule: TRequestBodyCreateSchedule,
	): Promise<TProductSchedule> {
		const data = await api.post<TProductSchedule, TRequestBodyCreateSchedule>(
			`/product/${productId}/schedule`,
			schedule,
			{},
			EServer.Backend,
		);
		return data;
	},

	async addScheduleToCart(scheduleId: string): Promise<TCartSummary> {
		const data = await api.post<TCartSummary>(
			`/schedule/${scheduleId}/add-to-cart`,
			{},
			{},
			EServer.Backend,
		);
		return data;
	},

	async deleteSchedule(scheduleId: string): Promise<TProductSchedule> {
		const data = await api.delete<TProductSchedule>(
			`/schedule/${scheduleId}`,
			undefined,
			{},
			EServer.Backend,
		);
		return data;
	},
};
