import { api, EServer } from '@/lib';
import { TLocation, TPagination } from '@/types';

import { TRequestQueryGetLocations } from './location.type';

export const locationApi = {
	async getLocations(
		query?: TRequestQueryGetLocations,
	): Promise<[TLocation[], TPagination?]> {
		const response = await api.get<TLocation[]>('/location', {
			...query,
			page: 1,
			limit: 10000,
		}, EServer.Backend);
		return [response.data, response.pagination];
	},
};
