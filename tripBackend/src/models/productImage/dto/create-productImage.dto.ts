import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectProductDto } from '../../product/dto/connect-product.dto';

export class CreateProductImageProductRelationInputDto {
	@ApiProperty({
		type: ConnectProductDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductDto)
	connect: ConnectProductDto;
}

@ApiExtraModels(ConnectProductDto, CreateProductImageProductRelationInputDto)
export class CreateProductImageDto {
	@ApiProperty({
		type: CreateProductImageProductRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductImageProductRelationInputDto)
	product: CreateProductImageProductRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	url: string;
}
