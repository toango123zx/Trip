import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { CreateInfoBillDto } from '../../infoBill/dto/create-infoBill.dto';
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
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	transactionTargetId: string;
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
