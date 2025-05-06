import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TLocationState } from './location.type';
import { locationThunk } from './locationThunk';

const initialState: TLocationState = {
	locations: [],
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const locationSlice = createSlice({
	name: 'location',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(locationThunk.getLocations.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(locationThunk.getLocations.fulfilled, (state, action) => {
				state.loading = false;
				state.locations = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
			})
			.addCase(locationThunk.getLocations.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
