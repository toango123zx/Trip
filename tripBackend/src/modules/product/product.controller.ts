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
import { ProductEntity, ProductScheduleEntity, RoomTypeEntity } from 'src/models';

import { Auth, AuthPermission, AuthRole, OptionalAuth } from '../auth/decorators';
import { DiscountFilterRequestDto, GetDiscountsResponseDto } from '../discount/dtos';
import {
	GetProductRatesResponseDto,
	ProductRateFilterRequestDto,
} from '../productRate/dto';
import { ProductViewLog } from '../productViewLog/decorators';
import { SupplierInformation } from '../supplier/decorators';
import { SupplierInformationDto } from '../supplier/dtos';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	CreateProductCommand,
	CreateProductRateByProductIdCommand,
	CreateProductScheduleByProductIdCommand,
	CreateRoomTypeByProductIdCommand,
	DeleteProductByProductIdCommand,
	UpdateProductInformationByProductIdCommand,
} from './commands/implements';
import { UpdateProductVector } from './decorators';
import {
	CreateProductScheduleByProductIdRequestDto,
	CreateProductRequestDto,
	GetProductsResponseDto,
	ProductFilterRequestDto,
	UpdateProductInformationByProductIdRequestDto,
	CreateProductRateByProductIdRequestDto,
	CreateRoomTypeRequestDto,
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
	@OptionalAuth()
	async getProducts(
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation?: UserInformationDto,
		@Query() filter?: ProductFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetProductsResponseDto[]>> {
		return this.queryBus.execute(
			new GetProductsQuery(pagination, myInformation, filter),
		);
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
	@ProductViewLog()
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
	@UpdateProductVector()
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

	@Post('/:productId/room-type')
	@AuthPermission(PermissionEnum.CreateRoomTypeForAccommodation)
	async createRoomTypeByProductId(
		@Param('productId') productId: string,
		@Body() createRoomTypeRequestDto: CreateRoomTypeRequestDto,
		@SupplierInformation() supplierInformation: SupplierInformationDto,
	): Promise<HttpResponseBodyDto<RoomTypeEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateRoomTypeByProductIdCommand(
				productId,
				createRoomTypeRequestDto,
				supplierInformation,
			),
		);
	}

	@Post('/:productId/rate')
	@Auth()
	@UpdateProductVector()
	async createProductRateByProductId(
		@Param('productId') productId: string,
		@Body() productRateInformation: CreateProductRateByProductIdRequestDto,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetProductRatesResponseDto> | HttpException> {
		return this.commandBus.execute(
			new CreateProductRateByProductIdCommand(
				productId,
				productRateInformation,
				myInformation,
			),
		);
	}

	@Put('/:productId')
	@AuthPermission(PermissionEnum.UpdateProductInformation)
	@UpdateProductVector()
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
