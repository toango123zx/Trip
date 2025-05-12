import { Injectable } from '@nestjs/common';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { IPaginationQuery, OrderByEnum, OrderBySearchDto } from 'src/common';
import { CreateProductScheduleDto, ProductScheduleEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { ProductScheduleOrderByDto } from './dtos';

@Injectable()
export class ProductScheduleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProductSchedulesBySupplierId(
		supplierId: string,
		pagination: IPaginationQuery,
		status?: ProductScheduleStatusEnum,
		filter?: ProductScheduleOrderByDto,
		startTime?: Date,
		endTime?: Date,
	): Promise<[ProductScheduleEntity[], number]> {
		const orderBy = filter
			? new OrderBySearchDto().convertOrderByToORM<ProductScheduleOrderByDto>(
					filter,
				)
			: [];
		orderBy.push({
			startTime: OrderByEnum.ASC,
		});

		const [productSchedules, totalRecords] = await Promise.all([
			this.prismaService.productSchedule.findMany({
				include: {
					product: true,
				},
				where: {
					product: {
						supplierId: supplierId,
					},
					startTime: startTime,
					endTime: endTime,
					status: status,
				},
				orderBy: orderBy,
				take: pagination.take,
				skip: pagination.skip,
			}),
			this.prismaService.productSchedule.count({
				where: {
					product: {
						supplierId: supplierId,
					},
					startTime: startTime,
					endTime: endTime,
					status: status,
				},
			}),
		]);
		return [productSchedules, totalRecords];
	}

	async findProductScheduleByProductScheduleId(
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
