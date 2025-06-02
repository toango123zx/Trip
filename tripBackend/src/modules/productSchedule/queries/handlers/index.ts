import { GetProductScheduleByProductScheduleIdHandler } from './getProductScheduleByProductScheduleId.handler';
import { GetProductSchedulesBySupplierIdHandler } from './getProductSchedulesBySupplierId.handler';
import { GetUsersByProductScheduleIdHandler } from './getUsersByProductScheduleId.handler';

export const productScheduleQueryHandlers = [
	GetProductScheduleByProductScheduleIdHandler,
	GetProductSchedulesBySupplierIdHandler,
	GetUsersByProductScheduleIdHandler,
];
