import { GenderUserEnum, UserStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	image: string;
	@ApiProperty({
		enum: GenderUserEnum,
		enumName: 'GenderUserEnum',
		nullable: true,
	})
	gender: GenderUserEnum | null;
	@ApiProperty({
		type: 'string',
	})
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	dateOfBirth: Date | null;
	@ApiProperty({
		type: 'string',
		nullable: true,
	})
	phoneNumber: string | null;
	@ApiProperty({
		type: 'string',
		nullable: true,
	})
	address: string | null;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	balance: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	point: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updateAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	deletedAt: Date | null;
	@ApiProperty({
		enum: UserStatusEnum,
		enumName: 'UserStatusEnum',
	})
	status: UserStatusEnum;
}
