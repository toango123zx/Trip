import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';
import { CreateProductDto } from 'src/models';

export class CreateProductRequestDto extends OmitType(CreateProductDto, [
	'supplier',
	'location',
	'productCategory',
	'productImage',
	'mapAddress',
]) {
	@AutoTrim()
	name: string;
	@IsUrl()
	posterImageUrl: string;
	@AutoTrim()
	description: string;
	@Min(0.01)
	time: number;
	@Min(1)
	quantityAvailable: number;
	@Min(0)
	age: number;
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	locationId: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	productCategoryId: string;
	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
	})
	@IsOptional()
	@IsArray()
	@Type(() => String)
	@IsString({ each: true })
	@AutoTrim()
	productImageUrls?: string[];
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	@IsUrl()
	urlMap: string;
}
