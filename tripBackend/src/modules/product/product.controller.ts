import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PermissionEnum } from 'src/common';
import { ProductEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { SupplierInforamtion } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';

import { CreateProductCommand } from './commands/implements';
import { CreateProductRequestDto } from './dtos';

@Controller('prodcut')
export class ProductController {
	constructor(private readonly commandBus: CommandBus) {}

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
