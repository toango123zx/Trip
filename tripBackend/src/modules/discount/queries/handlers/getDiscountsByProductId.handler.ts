import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountsByProductIdResponseDto } from '../../dtos';
import { GetDiscountsByProductIdQuery } from '../implements';

@QueryHandler(GetDiscountsByProductIdQuery)
export class GetDiscountsByProductIdHandler
	implements IQueryHandler<GetDiscountsByProductIdQuery>
{
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		query: GetDiscountsByProductIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetDiscountsByProductIdResponseDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;
		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const { keyword, statusSearch, ...locationFilter } = query.filter || {};
		const [discounts, totalRecords] =
			await this.discountRepository.findDiscountByProductId(
				pagination,
				String(query.productId),
				keyword,
				statusSearch,
				locationFilter,
			);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);

		const discountsInformation = discounts.map(
			(discount) => new GetDiscountsByProductIdResponseDto(discount),
		);
		return {
			success: true,
			data: discountsInformation,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: discounts.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
