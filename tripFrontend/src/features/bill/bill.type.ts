import { TPagination } from '@/types';
import { EBillStatus, TBillSumary } from '@/types/bill.type';

export type TBillState = {
	bills: TBillSumary[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetBills = {
	page?: number;
	limit?: number;
	status?: EBillStatus;
};

export type CreateBillRequestDto = {
	scheduleIds: string[];
	quantity: number;
	totalPrice: number;
};
