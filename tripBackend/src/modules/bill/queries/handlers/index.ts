import { GetBillByBillIdHandler } from './getBillByBillId.handler';
import { GetBillsByUserIdHandler } from './getBillsByUserId.handler';
import { GetBillsManagementHandler } from './getBillsManagement.handler';

export const BillQueryHandlers = [
	GetBillByBillIdHandler,
	GetBillsByUserIdHandler,
	GetBillsManagementHandler,
];
