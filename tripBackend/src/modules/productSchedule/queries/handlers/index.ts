import { GetProductScheduleByProductScheduleIdHandler } from './getProductScheduleByProductScheduleId.handler';
import { GetProductSchedulesBySupplierIdHandler } from './getProductSchedulesBySupplierId.handler';

export const productScheduleQueryHandlers = [
	GetProductScheduleByProductScheduleIdHandler,
	GetProductSchedulesBySupplierIdHandler,
];
