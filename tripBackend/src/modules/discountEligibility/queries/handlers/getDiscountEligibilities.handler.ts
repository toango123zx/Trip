import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { DiscountEligibilityEntity } from 'src/models';

import { DiscountEligibilityRepository } from '../../discountEligibility.repository';
import { GetDiscountEligibilitiesQuery } from '../implements';

@QueryHandler(GetDiscountEligibilitiesQuery)
export class GetDiscountEligibilitiesHandler
	implements IQueryHandler<GetDiscountEligibilitiesQuery>
{
	constructor(
		private readonly discountEligibilityRepository: DiscountEligibilityRepository,
	) {}

	async execute(
		query: GetDiscountEligibilitiesQuery,
	): Promise<HttpResponseBodySuccessDto<DiscountEligibilityEntity[]>> {
		const { pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { keyword, statusSearch, ...discountEligibilityFilter } = filter;
		const [discountEligibility, totalRecords] =
			await this.discountEligibilityRepository.findDiscountEligibilities(
				page,
				keyword,
				statusSearch,
				discountEligibilityFilter,
			);

		return {
			success: true,
			data: discountEligibility,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
