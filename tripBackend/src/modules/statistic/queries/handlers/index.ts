import { GetBookedByUserIdHandler } from './getBookedByUserId.handler';
import { GetRevenueByUserIdHandler } from './getRevenueByUserId.handler';

export const StatisticQueryHandlers = [
	GetRevenueByUserIdHandler,
	GetBookedByUserIdHandler,
];
