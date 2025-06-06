import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';

import { GetProductsResponseDto, ProductOrderByDto } from '../../dtos';
import { ProductRepository } from '../../product.repository';
import { GetProductsQuery } from '../implement';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(
		query: GetProductsQuery,
	): Promise<HttpResponseBodySuccessDto<GetProductsResponseDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;
		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const {
			keyword,
			startTimeSearch,
			endTimeSearch,
			priceFromSearch,
			priceToSearch,
			locationName,
			citySearch,
			city,
			productCategoryName,
			statusSearch,
			...productFilter
		} = query.filter;

		const productOrderBy: ProductOrderByDto = {
			...productFilter,
			...(locationName || city
				? {
						location: {
							...(locationName && { displayName: locationName }),
							...(city && { city: city }),
						},
					}
				: {}),
			...(productCategoryName && {
				productCategory: {
					name: productCategoryName,
				},
			}),
		};
		const [products, totalRecords] = await this.productRepository.findProducts(
			keyword,
			pagination,
			undefined,
			statusSearch,
			productOrderBy,
			true,
			[ProductScheduleStatusEnum.active],
			startTimeSearch,
			endTimeSearch,
			priceFromSearch,
			priceToSearch,
			citySearch,
		);
		const totalPage = Math.ceil(totalRecords / query.pagination.limit);

		const productInformation = products.map(
			(product) => new GetProductsResponseDto(product),
		);

		return {
			success: true,
			data: productInformation,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: products.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
