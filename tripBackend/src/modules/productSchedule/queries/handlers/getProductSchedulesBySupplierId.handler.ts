import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { ProductScheduleRepository } from '../../productSchedule.repository';
import { GetProductSchedulesBySupplierIdQuery } from '../implements';

@QueryHandler(GetProductSchedulesBySupplierIdQuery)
export class GetProductSchedulesBySupplierIdHandler
	implements IQueryHandler<GetProductSchedulesBySupplierIdQuery>
{
	constructor(private readonly productScheduleRepository: ProductScheduleRepository) {}

	async execute(
		query: GetProductSchedulesBySupplierIdQuery,
	): Promise<HttpResponseBodySuccessDto<ProductScheduleEntity[]>> {
		const { supplierId, pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { startTimeSearch, endTimeSearch, status, ...productScheduleFilter } =
			filter;

		const [productSchedules, totalRecords] =
			await this.productScheduleRepository.findProductSchedulesBySupplierId(
				supplierId,
				page,
				status,
				productScheduleFilter,
				startTimeSearch ? new Date(startTimeSearch) : undefined,
				endTimeSearch ? new Date(endTimeSearch) : undefined,
			);

		return {
			success: true,
			data: productSchedules,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
