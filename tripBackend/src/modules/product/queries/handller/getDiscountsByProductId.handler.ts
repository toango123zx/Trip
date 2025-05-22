import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { GetDiscountsResponseDto } from 'src/modules/discount/dtos';

import { DiscountRepository } from 'src/modules/discount/discount.repository';

import { GetDiscountsByProductIdQuery } from '../implement/getDiscountsByProductId.query';

@QueryHandler(GetDiscountsByProductIdQuery)
export class GetDiscountsByProductIdHandler
	implements IQueryHandler<GetDiscountsByProductIdQuery>
{
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		query: GetDiscountsByProductIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetDiscountsResponseDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;
		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const { keyword, statusSearch, ...locationFilter } = query.filter || {};
		const [discounts, totalRecords] =
			await this.discountRepository.findDiscountsByProductId(
				pagination,
				String(query.productId),
				keyword,
				statusSearch,
				locationFilter,
			);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);

		const discountsInformation = discounts.map(
			(discount) => new GetDiscountsResponseDto(discount),
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
