import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { ProductEntity, ProductScheduleEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { SupplierInforamtion } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';

import {
	CreateProductCommand,
	CreateProductScheduleByProductIdCommand,
} from './commands/implements';
import {
	CreateProductScheduleByProductIdRequestDto,
	CreateProductRequestDto,
	GetProductsResponseDto,
	ProductFilterRequestDto,
} from './dtos';
import { GetProductByProductIdResponseDto } from './dtos/responses/getProductBByProductId.response';
import { GetProductByProductIdQuery, GetProductsQuery } from './queries/implement';

@Controller('product')
export class ProductController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	async getProducts(
		@Query() pagination: PaginationDto,
		@Query() filter?: ProductFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetProductsResponseDto[]>> {
		return this.queryBus.execute(new GetProductsQuery(pagination, filter));
	}

	@Get('/:productId')
	async getProductByProductId(
		@Param('productId') productId: string,
	): Promise<HttpResponseBodyDto<GetProductByProductIdResponseDto | HttpException>> {
		return this.queryBus.execute(new GetProductByProductIdQuery(productId));
	}

	@Post()
	@AuthPermission(PermissionEnum.CreateProduct)
	async createProduct(
		@Body() createProductRequestDto: CreateProductRequestDto,
		@SupplierInforamtion() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<ProductEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateProductCommand(createProductRequestDto, supplierInformation),
		);
	}

	@Post('/:productId/schedule')
	@AuthPermission(PermissionEnum.CreateProductSchedule)
	async createProductScheduleByProductId(
		@Param('productId') productId: string,
		@Body() productScheduleInformation: CreateProductScheduleByProductIdRequestDto,
		@SupplierInforamtion() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateProductScheduleByProductIdCommand(
				productId,
				productScheduleInformation,
				supplierInformation,
			),
		);
	}
}
