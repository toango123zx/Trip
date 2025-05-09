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

const deleteSchedule = createAsyncThunk(
	'schedule/deleteSchedule',
	async (scheduleId: string) => {
		const data = await scheduleApi.deleteSchedule(scheduleId);
		return data;
	},
);

export const scheduleThunk = {
	createSchedule,
	deleteSchedule,
};
