import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { DiscountTypeEntity } from 'src/models';

import { DiscountTypeRepository } from '../../discountType.repository';
import { GetDiscountTypesQuery } from '../implements';

@QueryHandler(GetDiscountTypesQuery)
export class GetDiscountTypesHandler implements IQueryHandler<GetDiscountTypesQuery> {
	constructor(private readonly discountTypeRepository: DiscountTypeRepository) {}

	async execute(
		query: GetDiscountTypesQuery,
	): Promise<HttpResponseBodySuccessDto<DiscountTypeEntity[]>> {
		const { pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, statusSearch, ...discountTypeFilter } = filter;
		const [discountType, totalRecords] =
			await this.discountTypeRepository.findDiscountTypes(
				page,
				keyword,
				statusSearch,
				discountTypeFilter,
			);

		return {
			success: true,
			data: discountType,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
