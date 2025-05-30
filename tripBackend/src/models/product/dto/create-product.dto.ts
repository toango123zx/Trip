import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectSupplierDto } from '../../supplier/dto/connect-supplier.dto';
import { ConnectLocationDto } from '../../location/dto/connect-location.dto';
import { CreateMapAddressDto } from '../../mapAddress/dto/create-mapAddress.dto';
import { ConnectProductCategoryDto } from '../../productCategory/dto/connect-productCategory.dto';

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
export class CreateProductMapAddressRelationInputDto {
	@ApiProperty({
		type: CreateMapAddressDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateMapAddressDto)
	create: CreateMapAddressDto;
}
export class CreateProductProductImageRelationInputDto {
	@ApiProperty({
		type: CreateProductImageDto,
		isArray: true,
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateProductImageDto)
	create: CreateProductImageDto[];
}

@ApiExtraModels(
	ConnectSupplierDto,
	CreateProductSupplierRelationInputDto,
	ConnectLocationDto,
	CreateProductLocationRelationInputDto,
	ConnectProductCategoryDto,
	CreateProductProductCategoryRelationInputDto,
	CreateMapAddressDto,
	CreateProductMapAddressRelationInputDto,
	CreateProductImageDto,
	CreateProductProductImageRelationInputDto,
)
export class CreateProductDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	name: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	posterImageUrl: string;
	@ApiProperty({
		type: CreateProductSupplierRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductSupplierRelationInputDto)
	supplier: CreateProductSupplierRelationInputDto;
	@ApiProperty({
		minimum: 0.01,
		type: 'number',
		format: 'float',
	})
	@IsNotEmpty()
	@IsNumber()
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
	@ApiProperty({
		required: false,
		nullable: true,
		type: CreateProductMapAddressRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProductMapAddressRelationInputDto)
	mapAddress?: CreateProductMapAddressRelationInputDto | null;
	@ApiProperty({
		required: false,
		type: CreateProductProductImageRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProductProductImageRelationInputDto)
	productImage?: CreateProductProductImageRelationInputDto;
}
