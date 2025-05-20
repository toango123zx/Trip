import { createAsyncThunk } from '@reduxjs/toolkit';

import { EProductScheduleStatus } from '@/types';

import { TRequestBodyCreateSchedule } from './schedule.type';
import { scheduleApi } from './scheduleApi';

const getSchedules = createAsyncThunk(
	'schedule/getSchedules',
	async (query?: { page?: number; limit?: number }) => {
		const response = await scheduleApi.getSchedules(query);
		return response;
	},
);

const getScheduleByScheduleId = createAsyncThunk(
	'schedule/getScheduleByScheduleId',
	async ({
		scheduleId,
		status,
	}: {
		scheduleId: string;
		status: EProductScheduleStatus;
	}) => {
		const data = await scheduleApi.getScheduleByScheduleId(scheduleId, status);
		return data;
	},
);

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
	getSchedules,
	getScheduleByScheduleId,
	createSchedule,
	deleteSchedule,
};
