import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TBillState } from './bill.type';
import { billThunk } from './billThunk';

const initialState: TBillState = {
	bills: [],
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const billSlice = createSlice({
	name: 'bill',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(billThunk.getBillByUserId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(billThunk.getBillByUserId.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.bills = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
			})
			.addCase(billThunk.getBillByUserId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(billThunk.createBill.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(billThunk.createBill.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
			})
			.addCase(billThunk.createBill.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
