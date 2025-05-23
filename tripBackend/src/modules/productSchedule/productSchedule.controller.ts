import {
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { Auth, AuthPermission } from '../auth/decorators';
import { GetCartResponseDto } from '../cart/dtos/responses/getCart.response';
import { SupplierInformation } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	AddToCartByProductScheduleIdCommand,
	DeleteProductScheduleByProductScheduleIdCommand,
	UpdateCompletedProductScheduleByProductScheduleCompleteCommand,
} from './commands/implements';
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

	@Post(':productScheduleId/add-to-cart')
	@Auth()
	async addProductScheduleToCart(
		@Param('productScheduleId') productScheduleId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetCartResponseDto> | HttpException> {
		return this.commandBus.execute(
			new AddToCartByProductScheduleIdCommand(productScheduleId, myInformation),
		);
	}

	@Put(':productScheduleId/completed')
	@AuthPermission(PermissionEnum.UpdateCompletedProductSchedule)
	async updateCompletedProductSchedule(
		@Param('productScheduleId') productScheduleId: string,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity | HttpException>> {
		return this.commandBus.execute(
			new UpdateCompletedProductScheduleByProductScheduleCompleteCommand(
				productScheduleId,
				supplierInformation,
			),
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
