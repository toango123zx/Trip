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
			});
	},
});
