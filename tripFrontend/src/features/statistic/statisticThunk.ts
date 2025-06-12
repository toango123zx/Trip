import { createAsyncThunk } from '@reduxjs/toolkit';

import { TRequestQueryQueryStatistic } from './statistic.type';
import { statisticApi } from './statisticApi';

const getRevenue = createAsyncThunk(
	'statistic/revenue',
	async (query: TRequestQueryQueryStatistic) => {
		const response = await statisticApi.getRevenue(query);
		return response;
	},
);

const getBooked = createAsyncThunk(
	'statistic/booked',
	async (query: TRequestQueryQueryStatistic) => {
		const response = await statisticApi.getBooked(query);
		return response;
	},
);

export const statisticThunk = {
	getRevenue,
	getBooked,
};
