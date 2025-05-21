import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectBillDto } from '../../bill/dto/connect-bill.dto';
import { ConnectPaymentMethodDto } from '../../paymentMethod/dto/connect-paymentMethod.dto';

export class CreateTransactionSessionBillRelationInputDto {
	@ApiProperty({
		type: ConnectBillDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectBillDto)
	connect: ConnectBillDto;
}
export class CreateTransactionSessionPaymentMethodRelationInputDto {
	@ApiProperty({
		type: ConnectPaymentMethodDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectPaymentMethodDto)
	connect: ConnectPaymentMethodDto;
}

@ApiExtraModels(
	ConnectBillDto,
	CreateTransactionSessionBillRelationInputDto,
	ConnectPaymentMethodDto,
	CreateTransactionSessionPaymentMethodRelationInputDto,
)
export class CreateTransactionSessionDto {
	@ApiProperty({
		type: CreateTransactionSessionBillRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateTransactionSessionBillRelationInputDto)
	bill: CreateTransactionSessionBillRelationInputDto;
	@ApiProperty({
		type: CreateTransactionSessionPaymentMethodRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateTransactionSessionPaymentMethodRelationInputDto)
	paymentMethod: CreateTransactionSessionPaymentMethodRelationInputDto;
}
