import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountsResponseDto } from '../../dtos';
import { GetDiscountsQuery } from '../implements';

@QueryHandler(GetDiscountsQuery)
export class GetDiscountsHandler implements IQueryHandler<GetDiscountsQuery> {
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		query: GetDiscountsQuery,
	): Promise<HttpResponseBodySuccessDto<GetDiscountsResponseDto[]>> {
		const page = new PaginationUtils().extractSkipTakeFromPagination(
			query.pagination,
		);
		const { keyword, statusSearch, ...discountFilter } = query.filter;
		const [discounts, totalRecords] = await this.discountRepository.findDiscounts(
			undefined,
			keyword,
			statusSearch,
			true,
			page,
			discountFilter,
		);

		const discountsInformation = discounts.map(
			(discount) => new GetDiscountsResponseDto(discount),
		);

		return {
			success: true,
			data: discountsInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
