import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

import { GetProductsResponseDto, ProductOrderByDto } from '../../dtos';
import { ProductRepository } from '../../product.repository';
import { GetProductsManagementQuery } from '../implement';

@QueryHandler(GetProductsManagementQuery)
export class GetProductsManagementHandler
	implements IQueryHandler<GetProductsManagementQuery>
{
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(
		query: GetProductsManagementQuery,
	): Promise<HttpResponseBodySuccessDto<GetProductsResponseDto[]>> {
		const { pagination, myInformation, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

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
		} = filter;

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
			myInformation.roleName.includes('admin') ? undefined : myInformation.id,
			statusSearch,
			productOrderBy,
			false,
			undefined,
			startTimeSearch,
			endTimeSearch,
			priceFromSearch,
			priceToSearch,
			citySearch,
		);

		const productInformation = products.map(
			(product) => new GetProductsResponseDto(product),
		);

		return {
			success: true,
			data: productInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
