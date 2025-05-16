import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	PaginationUtils,
	RoleEnum,
} from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { ProductRepository } from 'src/modules/product/product.repository';
import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { DiscountRepository } from '../../discount.repository';
import { GetNonDiscountableSchedulesQuery } from '../implements';

@QueryHandler(GetNonDiscountableSchedulesQuery)
export class GetNonDiscountableSchedulesHandler
	implements IQueryHandler<GetNonDiscountableSchedulesQuery>
{
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly discountRepository: DiscountRepository,
	) {}

	async execute(
		query: GetNonDiscountableSchedulesQuery,
	): Promise<HttpResponseBodySuccessDto<ProductScheduleEntity[]> | HttpException> {
		const { discountId, productId, pagination, myInformation, filter } = query;
		const discount =
			await this.discountRepository.findDiscountByDiscountId(discountId);
		if (!discount) {
			throw new NotFoundException('discountId');
		}

		const product = await this.productRepository.findProductByProductId(productId);
		if (!product) {
			throw new NotFoundException('productId');
		}

		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { startTimeSearch, endTimeSearch, status, ...productScheduleFilter } =
			filter;

		const userId =
			myInformation.roleName === RoleEnum.Supplier ? myInformation.id : undefined;

		const [productSchedules, totalRecords] =
			await this.productScheduleRepository.findNonProductSchedulesByDiscountIdAndUserId(
				discountId,
				productId,
				userId,
				page,
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
