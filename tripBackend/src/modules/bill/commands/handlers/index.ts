import { CancelBillByBillIdHandler } from './cancelBillByBillId.handler';
import { CreateBillHandler } from './createBill.command';
import { PaymentBillByBillIdHandler } from './paymentBillByBillId.handler';
import { UpdatePaidBillHandler } from './updatePaidBill.command';

export const BillCommandHandlers = [
	CancelBillByBillIdHandler,
	CreateBillHandler,
	PaymentBillByBillIdHandler,
	UpdatePaidBillHandler,
];
