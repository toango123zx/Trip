import { Injectable } from '@nestjs/common';

import { CreateProductViewLogDto, ProductViewLogEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ProductViewLogRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createProductViewLog(
		productViewLog: CreateProductViewLogDto,
	): Promise<ProductViewLogEntity> {
		return this.prismaService.productViewLog.create({
			data: {
				...productViewLog,
				user: {
					connect: {
						id: productViewLog.user.connect.id,
					},
				},
			},
		});
	}
}
