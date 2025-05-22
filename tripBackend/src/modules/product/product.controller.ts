import {
	Body,
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

import { HttpResponseBodyDto, PaginationDto, PermissionEnum, RoleEnum } from 'src/common';
import { ProductEntity, ProductScheduleEntity } from 'src/models';

import { AuthPermission, AuthRole } from '../auth/decorators';
import { DiscountFilterRequestDto, GetDiscountsResponseDto } from '../discount/dtos';
import {
	GetProductRatesResponseDto,
	ProductRateFilterRequestDto,
} from '../productRate/dto';
import { SupplierInformation } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	CreateProductCommand,
	CreateProductScheduleByProductIdCommand,
	DeleteProductByProductIdCommand,
	UpdateProductInformationByProductIdCommand,
} from './commands/implements';
import {
	CreateProductScheduleByProductIdRequestDto,
	CreateProductRequestDto,
	GetProductsResponseDto,
	ProductFilterRequestDto,
	UpdateProductInformationByProductIdRequestDto,
} from './dtos';
import { GetProductByProductIdResponseDto } from './dtos/responses/getProductBByProductId.response';
import {
	GetDiscountsByProductIdQuery,
	GetProductByProductIdQuery,
	GetProductRatesByProductIdQuery,
	GetProductsManagementQuery,
	GetProductsQuery,
} from './queries/implement';

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

	@Get('/management')
	@AuthPermission(PermissionEnum.FindProductsForRole)
	async getProductsManagement(
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation: UserInformationDto,
		@Query() filter?: ProductFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetProductsResponseDto[]>> {
		return this.queryBus.execute(
			new GetProductsManagementQuery(pagination, myInformation, filter),
		);
	}

	@Get('/:productId')
	async getProductByProductId(
		@Param('productId') productId: string,
	): Promise<HttpResponseBodyDto<GetProductByProductIdResponseDto | HttpException>> {
		return this.queryBus.execute(new GetProductByProductIdQuery(productId));
	}

	@Get('/:productId/rate')
	async getProductRateByProductId(
		@Param('productId') productId: string,
		@Query() pagination: PaginationDto,
		@Query() search?: ProductRateFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetProductRatesResponseDto[]> | HttpException> {
		return this.queryBus.execute(
			new GetProductRatesByProductIdQuery(productId, pagination, search),
		);
	}

	@Get('/:productId/discount')
	async getDiscountsByProductId(
		@Param('productId') productId: string,
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetDiscountsResponseDto[]>> {
		return this.queryBus.execute(
			new GetDiscountsByProductIdQuery(productId, pagination, search),
		);
	}

	@Post()
	@AuthPermission(PermissionEnum.CreateProduct)
	async createProduct(
		@Body() createProductRequestDto: CreateProductRequestDto,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
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
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateProductScheduleByProductIdCommand(
				productId,
				productScheduleInformation,
				supplierInformation,
			),
		);
	}

	@Put('/:productId')
	@AuthPermission(PermissionEnum.UpdateProductInformation)
	async updateProductInformationByProductId(
		@Param('productId') productId: string,
		@Body() productInformationRequest: UpdateProductInformationByProductIdRequestDto,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<GetProductsResponseDto | HttpException>> {
		return this.commandBus.execute(
			new UpdateProductInformationByProductIdCommand(
				productId,
				productInformationRequest,
				supplierInformation,
			),
		);
	}

	@Delete('/:productId')
	@AuthRole(RoleEnum.Supplier)
	async deleteProductByProductId(
		@Param('productId') productId: string,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<ProductEntity | HttpException>> {
		return this.commandBus.execute(
			new DeleteProductByProductIdCommand(productId, supplierInformation),
		);
	}
}
