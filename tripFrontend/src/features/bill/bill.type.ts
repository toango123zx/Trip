import { TPagination } from '@/types';
import { EBillStatus, TBill, TBillSumary } from '@/types/bill.type';

export type TBillState = {
  bills: TBillSumary[];
  billDetail: TBill;
  paymentBillUrl: string;
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
  schedules: {
    scheduleId: string;
    quantity: number;
  }[];
  discountIds: string[];
};
