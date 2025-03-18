import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Min } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';
import { CreateProductDto } from 'src/models';

export class CreateProductRequestDto extends OmitType(CreateProductDto, [
	'supplier',
	'location',
	'productCategory',
]) {
	@AutoTrim()
	name: string;
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
	locationId: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	productCategoryId: string;
}
