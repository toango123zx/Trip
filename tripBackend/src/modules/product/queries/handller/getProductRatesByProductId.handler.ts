import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductRateStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';
import { GetProductRatesResponseDto } from 'src/modules/productRate/dto';

import { ProductRateRepository } from 'src/modules/productRate/productRate.repository';

import { ProductRepository } from '../../product.repository';
import { GetProductRatesByProductIdQuery } from '../implement';

@QueryHandler(GetProductRatesByProductIdQuery)
export class GetProductRatesByProductIdHandler
	implements IQueryHandler<GetProductRatesByProductIdQuery>
{
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly productRateRepository: ProductRateRepository,
	) {}

	async execute(
		query: GetProductRatesByProductIdQuery,
	): Promise<
		HttpResponseBodySuccessDto<GetProductRatesResponseDto[]> | NotFoundException
	> {
		const { productId, pagination, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { starSearch, statusSearch, ...productRateFilter } = filter;

		const product = await this.productRepository.findProductByProductId(
			productId,
			ProductRateStatusEnum.active,
		);
		if (!product) {
			throw new NotFoundException('productId');
		}

		const [productRates, totalRecords] =
			await this.productRateRepository.findProductRatesByProductId(
				productId,
				undefined,
				starSearch ? Number(starSearch) : undefined,
				statusSearch,
				page,
				productRateFilter,
			);

		const productRateInformation = productRates.map(
			(productRate) => new GetProductRatesResponseDto(productRate),
		);

		return {
			success: true,
			data: productRateInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
