import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectBillDto } from '../../bill/dto/connect-bill.dto';
import { ConnectDiscountDto } from '../../discount/dto/connect-discount.dto';

export class CreateDiscountForBillBillRelationInputDto {
	@ApiProperty({
		type: ConnectBillDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectBillDto)
	connect: ConnectBillDto;
}
export class CreateDiscountForBillDiscountRelationInputDto {
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
	CreateDiscountForBillBillRelationInputDto,
	ConnectDiscountDto,
	CreateDiscountForBillDiscountRelationInputDto,
)
export class CreateDiscountForBillDto {
	@ApiProperty({
		type: CreateDiscountForBillBillRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountForBillBillRelationInputDto)
	bill: CreateDiscountForBillBillRelationInputDto;
	@ApiProperty({
		type: CreateDiscountForBillDiscountRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountForBillDiscountRelationInputDto)
	discount: CreateDiscountForBillDiscountRelationInputDto;
}
