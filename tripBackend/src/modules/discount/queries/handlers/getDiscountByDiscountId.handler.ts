import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountByDiscountIdResponseDto } from '../../dtos';
import { GetDiscountByDiscountIdQuery } from '../implements';

@QueryHandler(GetDiscountByDiscountIdQuery)
export class GetDiscountByDiscountIdHandler
	implements IQueryHandler<GetDiscountByDiscountIdQuery>
{
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		query: GetDiscountByDiscountIdQuery,
	): Promise<
		HttpResponseBodySuccessDto<GetDiscountByDiscountIdResponseDto> | HttpException
	> {
		const discount = await this.discountRepository.findDiscountByDiscountId(
			query.discountId,
			query.status,
		);

		if (!discount) {
			throw new NotFoundException('discountId');
		}

		return {
			success: true,
			data: new GetDiscountByDiscountIdResponseDto(discount),
		};
	}
}
