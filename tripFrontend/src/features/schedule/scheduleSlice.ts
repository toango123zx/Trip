import { createSlice } from '@reduxjs/toolkit';

import { TPagination, TProductSchedule } from '@/types';

import { TScheduleState } from './schedule.type';
import { scheduleThunk } from './scheduleThunk';

const initialState: TScheduleState = {
	schedules: [],
	scheduleDetail: {} as TProductSchedule,
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const scheduleSlice = createSlice({
	name: 'schedule',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(scheduleThunk.getSchedules.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(scheduleThunk.getSchedules.fulfilled, (state, action) => {
				state.loading = false;
				state.schedules = action.payload.data;
				state.pagination = action.payload.pagination;
				state.error = null;
			})
			.addCase(scheduleThunk.getSchedules.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(scheduleThunk.createSchedule.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(scheduleThunk.createSchedule.fulfilled, (state, action) => {
				state.loading = false;
				state.scheduleDetail = action.payload;
				state.error = null;
			})
			.addCase(scheduleThunk.createSchedule.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(scheduleThunk.deleteSchedule.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(scheduleThunk.deleteSchedule.fulfilled, (state, action) => {
				state.loading = false;
				state.scheduleDetail = action.payload;
				state.error = null;
			})
			.addCase(scheduleThunk.deleteSchedule.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
