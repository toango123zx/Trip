import { api, EServer } from '@/lib';
import { TPagination } from '@/types';
import { TBill, TBillSumary } from '@/types/bill.type';

import { CreateBillRequestDto, TRequestQueryGetBills } from './bill.type';

export const billApi = {
  async getBillByUserId(
    query: TRequestQueryGetBills = {},
  ): Promise<[TBillSumary[], TPagination?]> {
    const response = await api.get<TBillSumary[], TRequestQueryGetBills>(
      `/bill/`,
      query,
      EServer.Backend,
    );
    return [response.data, response.pagination];
  },

  async getBillsManagement(
    query: TRequestQueryGetBills = {},
  ): Promise<[TBillSumary[], TPagination?]> {
    const response = await api.get<TBillSumary[], TRequestQueryGetBills>(
      `/bill/management`,
      query,
      EServer.Backend,
    );
    return [response.data, response.pagination];
  },

  async getBillByBillId(billId: string): Promise<TBill> {
    const response = await api.get<TBill>(
      `/bill/${billId}`,
      {},
      EServer.Backend
    );
    return response.data;
  },

  async createBill(bill: CreateBillRequestDto): Promise<TBill> {
    const data = await api.post<TBill, CreateBillRequestDto>(
      `/bill`,
      bill,
      {},
      EServer.Backend,
    );
    return data;
  },

  async paymentBillByBillId(billId: string): Promise<string> {
    const data = await api.post<string>(`/bill/${billId}/payment`,
      {},
      {},
      EServer.Backend,
    );
    return data;
  },

  async payConfirmWithdrawal(billId: string): Promise<any> {
    const data = await api.put(`/bill/${billId}/withdrawal/confirm`,
      {},
      {},
      EServer.Backend,
    );
    return data;
  },

  async cancelBillByBillId(billId: string): Promise<TBill> {
    const data = await api.delete<TBill>(`/bill/${billId}`,
      {},
      {},
      EServer.Backend,
    );
    return data;
  },
};
