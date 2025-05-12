import { api, EServer } from '@/lib';
import { TProductSchedule } from '@/types';

import { TRequestBodyCreateSchedule } from './schedule.type';

export const scheduleApi = {
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

	async deleteSchedule(scheduleId: string): Promise<TProductSchedule> {
		const data = await api.delete<TProductSchedule>(
			`/schedule/${scheduleId}`,
			{},
			EServer.Backend,
		);
		return data;
	},
};
