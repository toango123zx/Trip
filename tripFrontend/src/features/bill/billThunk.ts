import { createAsyncThunk } from '@reduxjs/toolkit';

import { TPagination } from '@/types';
import { TBill, TBillSumary } from '@/types/bill.type';

import { CreateBillRequestDto, TRequestQueryGetBills } from './bill.type';
import { billApi } from './billApi';

const getBillByUserId = createAsyncThunk(
	'bill/getBillByUserId',
	async (query?: TRequestQueryGetBills): Promise<[TBillSumary[], TPagination?]> => {
		const [data, pagination] = await billApi.getBillByUserId(query);
		return [data, pagination];
	},
);

const createBill = createAsyncThunk(
	'bill/createBill',
	async (bill: CreateBillRequestDto): Promise<TBill> => {
		const data = await billApi.creatBill(bill);
		return data;
	},
);

export const billThunk = {
	getBillByUserId,
	createBill,
};
