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

import { ConnectRoleDto } from '../../role/dto/connect-role.dto';
import { CreateSupplierDto } from '../../supplier/dto/create-supplier.dto';

export class CreateUserRoleRelationInputDto {
	@ApiProperty({
		type: ConnectRoleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectRoleDto)
	connect: ConnectRoleDto;
}
export class CreateUserSupplierRelationInputDto {
	@ApiProperty({
		type: CreateSupplierDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateSupplierDto)
	create: CreateSupplierDto;
}

@ApiExtraModels(
	ConnectRoleDto,
	CreateUserRoleRelationInputDto,
	CreateSupplierDto,
	CreateUserSupplierRelationInputDto,
)
export class CreateUserDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	name: string;
	@ApiProperty({
		type: CreateUserRoleRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateUserRoleRelationInputDto)
	role: CreateUserRoleRelationInputDto;
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
		enumName: 'genderUserEnum',
		required: false,
		nullable: true,
	})
	@IsOptional()
	gender?: genderUserEnum | null;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsDateString()
	dateOfBirth?: Date | null;
	@ApiProperty({
		type: 'string',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsString()
	phoneNumber?: string | null;
	@ApiProperty({
		type: 'string',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsString()
	address?: string | null;
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
