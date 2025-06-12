import { createSlice } from '@reduxjs/toolkit';

import { TStatisticState } from './statistic.type';
import { statisticThunk } from './statisticThunk';

const initialState: TStatisticState = {
	revenueData: [],
	bookedData: [],
	loading: false,
	error: null,
};

export const statisticSlice = createSlice({
	name: 'statistic',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(statisticThunk.getRevenue.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(statisticThunk.getRevenue.fulfilled, (state, action) => {
				state.loading = false;
				state.revenueData = action.payload.data;
				state.error = null;
			})
			.addCase(statisticThunk.getRevenue.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(statisticThunk.getBooked.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(statisticThunk.getBooked.fulfilled, (state, action) => {
				state.loading = false;
				state.bookedData = action.payload.data;
				state.error = null;
			})
			.addCase(statisticThunk.getBooked.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})

	},
});
