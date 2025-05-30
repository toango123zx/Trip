import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectProductDto } from '../../product/dto/connect-product.dto';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateProductRateProductRelationInputDto {
	@ApiProperty({
		type: ConnectProductDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductDto)
	connect: ConnectProductDto;
}
export class CreateProductRateUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}

@ApiExtraModels(
	ConnectProductDto,
	CreateProductRateProductRelationInputDto,
	ConnectUserDto,
	CreateProductRateUserRelationInputDto,
)
export class CreateProductRateDto {
	@ApiProperty({
		type: CreateProductRateProductRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductRateProductRelationInputDto)
	product: CreateProductRateProductRelationInputDto;
	@ApiProperty({
		type: CreateProductRateUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductRateUserRelationInputDto)
	user: CreateProductRateUserRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	comment: string;
}
