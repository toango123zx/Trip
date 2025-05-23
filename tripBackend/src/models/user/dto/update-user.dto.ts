import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { GenderUserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { ConnectRoleDto } from '../../role/dto/connect-role.dto';

export class UpdateUserRoleRelationInputDto {
	@ApiProperty({
		type: ConnectRoleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectRoleDto)
	connect: ConnectRoleDto;
}

@ApiExtraModels(ConnectRoleDto, UpdateUserRoleRelationInputDto)
export class UpdateUserDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;
	@ApiProperty({
		required: false,
		type: UpdateUserRoleRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateUserRoleRelationInputDto)
	role?: UpdateUserRoleRelationInputDto;
	@ApiProperty({
		type: 'string',
		default: 'https://11',
		required: false,
	})
	@IsOptional()
	@IsString()
	image?: string;
	@ApiProperty({
		enum: GenderUserEnum,
		enumName: 'GenderUserEnum',
		required: false,
		nullable: true,
	})
	@IsOptional()
	gender?: GenderUserEnum | null;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	email?: string;
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
}
