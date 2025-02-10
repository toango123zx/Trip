import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { CreateSupplierDto } from '../../supplier/dto/create-supplier.dto';

export class CreateUserSupplierRelationInputDto {
	@ApiProperty({
		type: CreateSupplierDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateSupplierDto)
	create: CreateSupplierDto;
}

@ApiExtraModels(CreateSupplierDto, CreateUserSupplierRelationInputDto)
export class CreateUserDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	name: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	roleId: string;
	@ApiProperty({
		type: 'string',
		default: 'https://11',
		required: false,
	})
	@IsOptional()
	@IsString()
	image?: string;
	@ApiProperty({
		enum: genderUserEnum,
	})
	@IsNotEmpty()
	gender: genderUserEnum;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	dateOfBirth: Date;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	phoneNumber: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	address: string;
	@ApiProperty({
		required: false,
		nullable: true,
		type: CreateUserSupplierRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateUserSupplierRelationInputDto)
	supplier?: CreateUserSupplierRelationInputDto | null;
}
