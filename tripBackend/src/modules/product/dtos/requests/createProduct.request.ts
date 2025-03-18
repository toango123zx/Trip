import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProductDto } from 'src/models';

export class CreateProductRequestDto extends OmitType(CreateProductDto, [
	'supplier',
	'location',
	'productCategory',
]) {
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
