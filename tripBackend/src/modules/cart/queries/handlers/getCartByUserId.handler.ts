import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

import { CartRepository } from '../../cart.repository';
import { GetCartResponseDto } from '../../dtos/responses/getCart.response';
import { GetCartByUserIdQuery } from '../implements';

@QueryHandler(GetCartByUserIdQuery)
export class GetDiscountsByUserIdHandler implements IQueryHandler<GetCartByUserIdQuery> {
	constructor(private readonly cartRepository: CartRepository) {}

	async execute(
		query: GetCartByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetCartResponseDto[]>> {
		const { pagination, myInformation, filter } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const { keyword, ...cartFilter } = filter;

		const [carts, totalRecords] = await this.cartRepository.getCartByUserId(
			keyword,
			page,
			myInformation.id,
			cartFilter,
		);
		const cartsResponse = carts.map((cart) => new GetCartResponseDto(cart));
		return {
			success: true,
			data: cartsResponse,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
