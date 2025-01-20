import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectBillDto } from '../../bill/dto/connect-bill.dto';
import { ConnectDiscountDto } from '../../discount/dto/connect-discount.dto';

export class CreateInfoBillDiscountBillRelationInputDto {
	@ApiProperty({
		type: ConnectBillDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectBillDto)
	connect: ConnectBillDto;
}
export class CreateInfoBillDiscountDiscountRelationInputDto {
	@ApiProperty({
		type: ConnectDiscountDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectDiscountDto)
	connect: ConnectDiscountDto;
}

@ApiExtraModels(
	ConnectBillDto,
	CreateInfoBillDiscountBillRelationInputDto,
	ConnectDiscountDto,
	CreateInfoBillDiscountDiscountRelationInputDto,
)
export class CreateInfoBillDiscountDto {
	@ApiProperty({
		type: CreateInfoBillDiscountBillRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoBillDiscountBillRelationInputDto)
	bill: CreateInfoBillDiscountBillRelationInputDto;
	@ApiProperty({
		type: CreateInfoBillDiscountDiscountRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoBillDiscountDiscountRelationInputDto)
	discount: CreateInfoBillDiscountDiscountRelationInputDto;
}
