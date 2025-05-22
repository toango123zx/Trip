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

	async createBill(bill: CreateBillRequestDto): Promise<TBill> {
		const response = await api.post<TBill, CreateBillRequestDto>(
			`/bill`,
			bill,
			{},
			EServer.Backend,
		);
		return response;
	},
};
