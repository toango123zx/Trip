import { GetProductScheduleByProductScheduleIdHandler } from './getProductScheduleByProductScheduleId.handler';
import { GetProductSchedulesBySupplierIdHandler } from './getProductSchedulesBySupplierId.handler';
import { GetUsersByProductScheduleIdhandler } from './getUsersByProductScheduleId.handler';

export const productScheduleQueryHandlers = [
	GetProductScheduleByProductScheduleIdHandler,
	GetProductSchedulesBySupplierIdHandler,
	GetUsersByProductScheduleIdhandler,
];
