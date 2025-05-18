import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { BillEntity } from 'src/models';

import { BillRepository } from '../../bill.repository';
import { GetBillsByUserIdQuery } from '../implements';

@QueryHandler(GetBillsByUserIdQuery)
export class GetBillsByUserIdHandler implements IQueryHandler<GetBillsByUserIdQuery> {
	constructor(private readonly billRepository: BillRepository) {}

	async execute(
		query: GetBillsByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<BillEntity[]> | HttpException> {
		const { pagination, myInformation } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, userIdSearch, statusSearch, ...billFilter } = query.filter;
		const [bills, totalRecords] = await this.billRepository.getBillsByUserId(
			page,
			myInformation.id,
			userIdSearch,
			statusSearch,
			keyword,
			billFilter,
		);

		return {
			success: true,
			data: bills,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
