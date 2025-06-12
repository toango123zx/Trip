import { api, EServer } from '@/lib';

import { TRequestQueryQueryStatistic, TReSponseStatistic } from './statistic.type';

export const statisticApi = {
	async getRevenue(query: TRequestQueryQueryStatistic): Promise<{ data: TReSponseStatistic[] }> {
		const response = await api.get<TReSponseStatistic[]>(
			'/statistic/revenue',
			query,
			EServer.Backend,
		);
		return response;
	},

	async getBooked(query: TRequestQueryQueryStatistic): Promise<{ data: TReSponseStatistic[] }> {
		const response = await api.get<TReSponseStatistic[]>(
			'/statistic/booked',
			query,
			EServer.Backend,
		);
		return response;
	},
};
