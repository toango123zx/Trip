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
};
