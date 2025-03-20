import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { GetProductByProductIdResponseDto } from '../../dtos/responses/getProductBByProductId.response';
import { ProductRepository } from '../../product.repository';
import { GetProductByProductIdQuery } from '../implement';

@QueryHandler(GetProductByProductIdQuery)
export class GetProductByProductIdHandler
	implements IQueryHandler<GetProductByProductIdQuery>
{
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(
		query: GetProductByProductIdQuery,
	): Promise<
		HttpResponseBodySuccessDto<GetProductByProductIdResponseDto> | HttpException
	> {
		const { productId } = query;
		const product = await this.productRepository.findProductByProductId(
			productId,
			ProductStatusEnum.active,
		);
		if (!product) {
			throw new NotFoundException('productId');
		}

		return {
			success: true,
			data: new GetProductByProductIdResponseDto(product),
		};
	}
}
