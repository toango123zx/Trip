import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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
	Role: CreateUserRoleRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	image: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	gender: string;
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
