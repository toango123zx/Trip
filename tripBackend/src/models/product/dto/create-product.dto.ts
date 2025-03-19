import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ConnectLocationDto } from '../../location/dto/connect-location.dto';
import { ConnectProductCategoryDto } from '../../productCategory/dto/connect-productCategory.dto';
import { ConnectSupplierDto } from '../../supplier/dto/connect-supplier.dto';

export class CreateProductSupplierRelationInputDto {
	@ApiProperty({
		type: ConnectSupplierDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectSupplierDto)
	connect: ConnectSupplierDto;
}
export class CreateProductLocationRelationInputDto {
	@ApiProperty({
		type: ConnectLocationDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectLocationDto)
	connect: ConnectLocationDto;
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
	ConnectLocationDto,
	CreateProductLocationRelationInputDto,
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
		minimum: 0.01,
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	time: number;
	@ApiProperty({
		minimum: 1,
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	quantityAvailable: number;
	@ApiProperty({
		minimum: 0,
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
		type: CreateProductLocationRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductLocationRelationInputDto)
	location: CreateProductLocationRelationInputDto;
	@ApiProperty({
		type: CreateProductProductCategoryRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductProductCategoryRelationInputDto)
	productCategory: CreateProductProductCategoryRelationInputDto;
}
