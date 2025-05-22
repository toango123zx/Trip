import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsArray, IsString, IsNotEmpty } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';
import { UpdateProductDto } from 'src/models';

export class UpdateProductInformationByProductIdRequestDto extends UpdateProductDto {
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
	addProductImageUrls?: string[];
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
	removeProductImageIds?: string[];
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	urlMap?: string;
}
