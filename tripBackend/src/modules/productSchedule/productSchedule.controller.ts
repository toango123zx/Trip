import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { SupplierInformation } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';

import { DeleteProductScheduleByProductScheduleIdCommand } from './commands/implements';
import {
	DeleteProductScheduleByProductScheduleIdResponseDto,
	GetProductScheduleByProductScheduleIdRequestDto,
	ProductScheduleFilterRequestDto,
} from './dtos';
import {
	GetProductScheduleByProductScheduleIdQuery,
	GetProductSchedulesBySupplierIdQuery,
} from './queries/implements';

@Controller('schedule')
export class ProductScheduleController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	@AuthPermission(PermissionEnum.FindProductScheduleBySupplierId)
	@ApiOperation({ summary: 'Supplier Feature' })
	async getProductSchedulesBySupplierId(
		@SupplierInformation() supplierInformation: SupplierInformationDto,
		@Query() pagination: PaginationDto,
		@Query() filter?: ProductScheduleFilterRequestDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity[]>> {
		return this.queryBus.execute(
			new GetProductSchedulesBySupplierIdQuery(
				supplierInformation.supplier.id,
				pagination,
				filter,
			),
		);
	}

	@Get(':productScheduleId')
	async getProductScheduleByProductScheduleId(
		@Param('productScheduleId') productScheduleId: string,
		@Query() filter?: GetProductScheduleByProductScheduleIdRequestDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity>> {
		return this.queryBus.execute(
			new GetProductScheduleByProductScheduleIdQuery(productScheduleId, filter),
		);
	}

	@Delete(':productScheduleId')
	@AuthPermission(PermissionEnum.DeleteProductScheduleByProductScheduleId)
	async deleteProductScheduleByProductScheduleId(
		@Param('productScheduleId') productScheduleId: string,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<DeleteProductScheduleByProductScheduleIdResponseDto>> {
		return this.commandBus.execute(
			new DeleteProductScheduleByProductScheduleIdCommand(
				productScheduleId,
				supplierInformation,
			),
		);
	}
}
