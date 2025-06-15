import { createSlice } from '@reduxjs/toolkit';

import { TBill, TPagination } from '@/types';

import { TBillState } from './bill.type';
import { billThunk } from './billThunk';

const initialState: TBillState = {
  bills: [],
  billDetail: {} as TBill,
  paymentBillUrl: '',
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
      .addCase(billThunk.getBillByBillId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(billThunk.getBillByBillId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.billDetail = action.payload;
      })
      .addCase(billThunk.getBillByBillId.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      })
      .addCase(billThunk.createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(billThunk.createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.billDetail = action.payload;
        state.error = null;
      })
      .addCase(billThunk.createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      })
      .addCase(billThunk.paymentBillByBillId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(billThunk.paymentBillByBillId.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentBillUrl = action.payload;
        state.error = null;
      })
      .addCase(billThunk.paymentBillByBillId.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      })
      .addCase(billThunk.cancelBillByBillId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(billThunk.cancelBillByBillId.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(billThunk.cancelBillByBillId.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      });
  },
});
