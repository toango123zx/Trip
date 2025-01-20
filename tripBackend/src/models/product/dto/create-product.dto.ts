import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectSupplierDto } from '../../supplier/dto/connect-supplier.dto';
import { ConnectProductCategoryDto } from '../../product_category/dto/connect-product_category.dto';

export class CreateProductSupplierRelationInputDto {
	@ApiProperty({
		type: ConnectSupplierDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectSupplierDto)
	connect: ConnectSupplierDto;
}
export class CreateProductProductCategoryRelationInputDto {
	@ApiProperty({
		type: ConnectProductCategoryDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductCategoryDto)
	connect: ConnectProductCategoryDto;
}

@ApiExtraModels(
	ConnectSupplierDto,
	CreateProductSupplierRelationInputDto,
	ConnectProductCategoryDto,
	CreateProductProductCategoryRelationInputDto,
)
export class CreateProductDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	name: string;
	@ApiProperty({
		type: CreateProductSupplierRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductSupplierRelationInputDto)
	supplier: CreateProductSupplierRelationInputDto;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	time: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	quantityAvailable: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	age: number;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	description: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	avgRate: number;
	@ApiProperty({
		type: CreateProductProductCategoryRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductProductCategoryRelationInputDto)
	productCategory: CreateProductProductCategoryRelationInputDto;
}
