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

const getBillByBillId = createAsyncThunk(
  'bill/getBillByBillId',
  async (billId: string): Promise<TBill> => {
    const data = await billApi.getBillByBillId(billId);
    return data;
  },
);

const createBill = createAsyncThunk(
  'bill/createBill',
  async (bill: CreateBillRequestDto): Promise<TBill> => {
    const data = await billApi.createBill(bill);
    return data;
  },
);

const paymentBillByBillId = createAsyncThunk(
  'bill/payment',
  async (billId: string): Promise<string> => {
    const data = await billApi.paymentBillByBillId(billId);
    return data;
  },
);

const cancelBillByBillId = createAsyncThunk(
  'bill/cancel',
  async (billId: string): Promise<TBill> => {
    const data = await billApi.cancelBillByBillId(billId);
    return data;
  },
);

export const billThunk = {
  getBillByUserId,
  getBillByBillId,
  createBill,
  paymentBillByBillId,
  cancelBillByBillId,
};
