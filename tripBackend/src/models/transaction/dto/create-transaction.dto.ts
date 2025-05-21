import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { TransactionStatusEnum, TransactionTargetEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { ConnectBillDto } from '../../bill/dto/connect-bill.dto';
import { ConnectPaymentMethodDto } from '../../paymentMethod/dto/connect-paymentMethod.dto';

export class CreateTransactionBillRelationInputDto {
	@ApiProperty({
		type: ConnectBillDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectBillDto)
	connect: ConnectBillDto;
}
export class CreateTransactionPaymentMethodRelationInputDto {
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
	CreateTransactionBillRelationInputDto,
	ConnectPaymentMethodDto,
	CreateTransactionPaymentMethodRelationInputDto,
)
export class CreateTransactionDto {
	@ApiProperty({
		type: CreateTransactionBillRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateTransactionBillRelationInputDto)
	bill: CreateTransactionBillRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	transactionSessionCode: string;
	@ApiProperty({
		type: CreateTransactionPaymentMethodRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateTransactionPaymentMethodRelationInputDto)
	paymentMethod: CreateTransactionPaymentMethodRelationInputDto;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	amount: number;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	bankCode: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	cardType: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	description: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	BankTransactionCode: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	transactionCode: string;
	@ApiProperty({
		enum: TransactionTargetEnum,
		enumName: 'TransactionTargetEnum',
	})
	@IsNotEmpty()
	transactionTarget: TransactionTargetEnum;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	createAt: Date;
	@ApiProperty({
		enum: TransactionStatusEnum,
		enumName: 'TransactionStatusEnum',
		default: 'pending',
		required: false,
	})
	@IsOptional()
	status?: TransactionStatusEnum;
}
