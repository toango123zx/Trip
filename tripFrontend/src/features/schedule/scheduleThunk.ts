import { createAsyncThunk } from '@reduxjs/toolkit';

import { TRequestBodyCreateSchedule } from './schedule.type';
import { scheduleApi } from './scheduleApi';

const createSchedule = createAsyncThunk(
	'schedule/createSchedule',
	async ({
		productId,
		schedule,
	}: {
		productId: string;
		schedule: TRequestBodyCreateSchedule;
	}) => {
		const data = await scheduleApi.createSchedule(productId, schedule);
		return data;
	},
);
export const scheduleThunk = {
	createSchedule,
};
