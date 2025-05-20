import { CancelBillByBillIdHandler } from './cancelBillByBillId.handler';
import { CreateBillHandler } from './createBill.command';
import { UpdatePaidBillHandler } from './updatePaidBill.command';

export const BillCommandHandlers = [
	CreateBillHandler,
	UpdatePaidBillHandler,
	CancelBillByBillIdHandler,
];
