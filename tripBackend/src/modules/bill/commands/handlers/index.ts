import { CancelBillByBillIdHandler } from './cancelBillByBillId.handler';
import { ConfirmWithdrawalBillHandler } from './confirmWithdrawalBill.handler';
import { CreateBillHandler } from './createBill.command';
import { CreateWithdrawalBillByUserIdHandler } from './createWithdrawalBillByUserId.handler';
import { PaymentBillByBillIdHandler } from './paymentBillByBillId.handler';
import { UpdatePaidBillHandler } from './updatePaidBill.command';

export const BillCommandHandlers = [
	CancelBillByBillIdHandler,
	ConfirmWithdrawalBillHandler,
	CreateBillHandler,
	CreateWithdrawalBillByUserIdHandler,
	PaymentBillByBillIdHandler,
	UpdatePaidBillHandler,
];
