import { Injectable } from '@nestjs/common';

import { CreateProductScheduleDto, ProductScheduleEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ProductScheduleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createProductScheduleByProductId(
		scheduleInformation: CreateProductScheduleDto,
	): Promise<ProductScheduleEntity> {
		return await this.prismaService.productSchedule.create({
			data: scheduleInformation,
		});
	}
}
