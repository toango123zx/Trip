import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { ProductEntity } from 'src/models';

import {
	GetProductsResponseDto,
	ProductOrderByDto,
	ProductRecommendationsResponseDto,
} from '../../dtos';
import { ProductRepository } from '../../product.repository';
import { ProductRecommendationsService } from '../../services';
import { GetProductsQuery } from '../implement';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
	constructor(
		private readonly recommendationService: ProductRecommendationsService,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(
		query: GetProductsQuery,
	): Promise<HttpResponseBodySuccessDto<GetProductsResponseDto[]>> {
		const { myInformation } = query;
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
		let recommendations: ProductRecommendationsResponseDto[] = [];
		if (myInformation) {
			recommendations = await this.recommendationService.getRecommendations(
				myInformation.id,
			);
		}

		const productIdRecommendations =
			recommendations.length > 0
				? recommendations.map((recommendation) => recommendation.id)
				: undefined;
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
			productIdRecommendations && productIdRecommendations.length > 0
				? undefined
				: pagination,
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
			productIdRecommendations && productIdRecommendations.length > 0
				? undefined
				: productIdRecommendations,
		);
		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		let productsDb: ProductEntity[] = products;
		if (productIdRecommendations && productIdRecommendations.length > 0) {
			const productMap = new Map(products.map((p) => [p.id, p]));

			productsDb = productIdRecommendations
				.map((id) => productMap.get(id))
				.filter(Boolean)
				.slice(
					Number(pagination.skip),
					Number(Number(pagination.skip) + Number(pagination.take)),
				);
		}

		const productInformation = productsDb.map(
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
