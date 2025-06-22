import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { BillEntity } from 'src/models';

import { BillRepository } from '../../bill.repository';
import { GetBillsManagementQuery } from '../implements';

@QueryHandler(GetBillsManagementQuery)
export class GetBillsManagementHandler implements IQueryHandler<GetBillsManagementQuery> {
	constructor(private readonly billRepository: BillRepository) {}

	async execute(
		query: GetBillsManagementQuery,
	): Promise<HttpResponseBodySuccessDto<BillEntity[]> | HttpException> {
		const { pagination } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, userIdSearch, statusSearch, ...billFilter } = query.filter;
		const [bills, totalRecords] = await this.billRepository.findBillsManagement(
			page,
			billFilter,
		);

		return {
			success: true,
			data: bills,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
