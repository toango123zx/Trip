import { CreateBillHandler } from './createBill.command';
import { UpdatePaidBillHandler } from './updatePaidBill.command';

export const BillCommandHandlers = [CreateBillHandler, UpdatePaidBillHandler];
