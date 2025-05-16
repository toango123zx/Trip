import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountsByProductIdResponseDto } from '../../dtos';
import { GetDiscountsByUserIdQuery } from '../implements';

@QueryHandler(GetDiscountsByUserIdQuery)
export class GetDiscountsByUserIdHandler
	implements IQueryHandler<GetDiscountsByUserIdQuery>
{
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		query: GetDiscountsByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetDiscountsByProductIdResponseDto[]>> {
		const { myInformation, pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, statusSearch, ...discountFilter } = filter;
		const [discounts, totalRecords] =
			await this.discountRepository.findDiscountsByUserId(
				page,
				myInformation.id,
				keyword,
				statusSearch,
				discountFilter,
			);
		const discountsInformation = discounts.map(
			(discount) => new GetDiscountsByProductIdResponseDto(discount),
		);
		return {
			success: true,
			data: discountsInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
