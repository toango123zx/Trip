import { Injectable } from '@nestjs/common';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { CreateProductScheduleDto, ProductScheduleEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ProductScheduleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getProductScheduleByProductScheduleId(
		productScheduleId: string,
		status?: ProductScheduleStatusEnum,
	): Promise<ProductScheduleEntity> {
		return this.prismaService.productSchedule.findFirst({
			include: {
				product: true,
			},
			where: {
				id: productScheduleId,
				status: status,
			},
		});
	}

	async createProductScheduleByProductId(
		scheduleInformation: CreateProductScheduleDto,
	): Promise<ProductScheduleEntity> {
		return this.prismaService.productSchedule.create({
			data: scheduleInformation,
		});
	}
}
