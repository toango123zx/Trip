import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { DiscountApplicationScopeEntity } from 'src/models';

import { DiscountApplicationScopeRepository } from '../../discountApplicationScope.repository';
import { GetDiscountApplicationScopesQuery } from '../implements';

@QueryHandler(GetDiscountApplicationScopesQuery)
export class GetDiscountApplicationScopesHandler
	implements IQueryHandler<GetDiscountApplicationScopesQuery>
{
	constructor(
		private readonly discountApplicationScopeRepository: DiscountApplicationScopeRepository,
	) {}

	async execute(
		query: GetDiscountApplicationScopesQuery,
	): Promise<HttpResponseBodySuccessDto<DiscountApplicationScopeEntity[]>> {
		const { pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, statusSearch, ...discountApplicationScopeFilter } = filter;
		const [discountApplicationScopes, totalRecords] =
			await this.discountApplicationScopeRepository.findDiscountApplicationScopes(
				page,
				keyword,
				statusSearch,
				discountApplicationScopeFilter,
			);

		return {
			success: true,
			data: discountApplicationScopes,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
