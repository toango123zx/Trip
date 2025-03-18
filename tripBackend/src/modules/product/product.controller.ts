import { Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { ProductEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { SupplierInforamtion } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';

import { CreateProductCommand } from './commands/implements';
import {
	CreateProductRequestDto,
	GetProductsResponseDto,
	ProductFilterRequestDto,
} from './dtos';
import { GetProductsQuery } from './queries/implement';

@Controller('prodcut')
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
}
