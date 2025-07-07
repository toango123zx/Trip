import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

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
		const { myInformation, pagination } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const {
			keyword,
			startTimeSearch,
			endTimeSearch,
			priceFromSearch,
			priceToSearch,
			locationName,
			locationNameSearch,
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
				page,
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
			page,
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
				? productIdRecommendations
				: undefined,
			undefined,
			false,
			locationNameSearch,
		);
		let sortedProducts = [...products];
		if (recommendations.length > 0 && products.length >= 0) {
			const orderMap = new Map(
				recommendations.map((item, index) => [item.id, index]),
			);
			sortedProducts = [...products].sort((x, y) => {
				return (orderMap.get(x.id) ?? 0) - (orderMap.get(y.id) ?? 0);
			});
		}
		const productInformation = sortedProducts.map(
			(product) => new GetProductsResponseDto(product),
		);
		return {
			success: true,
			data: productInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
