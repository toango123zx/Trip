import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { CreateInfoBillDto } from '../../infoBill/dto/create-infoBill.dto';
import { ConnectPaymentMethodDto } from '../../paymentMethod/dto/connect-paymentMethod.dto';
import { CreateTransactionDto } from '../../transaction/dto/create-transaction.dto';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateBillUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}
export class CreateBillPaymentMethodRelationInputDto {
	@ApiProperty({
		type: ConnectPaymentMethodDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectPaymentMethodDto)
	connect: ConnectPaymentMethodDto;
}
export class CreateBillTransactionRelationInputDto {
	@ApiProperty({
		type: CreateTransactionDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateTransactionDto)
	create: CreateTransactionDto;
}
export class CreateBillInfoBillRelationInputDto {
	@ApiProperty({
		type: CreateInfoBillDto,
		isArray: true,
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateInfoBillDto)
	create: CreateInfoBillDto[];
}

@ApiExtraModels(
	ConnectUserDto,
	CreateBillUserRelationInputDto,
	ConnectPaymentMethodDto,
	CreateBillPaymentMethodRelationInputDto,
	CreateTransactionDto,
	CreateBillTransactionRelationInputDto,
	CreateInfoBillDto,
	CreateBillInfoBillRelationInputDto,
)
export class CreateBillDto {
	@ApiProperty({
		type: CreateBillUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateBillUserRelationInputDto)
	user: CreateBillUserRelationInputDto;
	@ApiProperty({
		type: CreateBillPaymentMethodRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateBillPaymentMethodRelationInputDto)
	paymentMethod: CreateBillPaymentMethodRelationInputDto;
	@ApiProperty({
		type: CreateBillTransactionRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateBillTransactionRelationInputDto)
	transaction: CreateBillTransactionRelationInputDto;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	reductionPrice: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	totalPrice: number;
	@ApiProperty({
		required: false,
		type: CreateBillInfoBillRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateBillInfoBillRelationInputDto)
	infoBill?: CreateBillInfoBillRelationInputDto;
}
