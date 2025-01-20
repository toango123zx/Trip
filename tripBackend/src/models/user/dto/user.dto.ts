import { userStatusEnum } from '@prisma/client';
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
		type: 'string',
	})
	gender: string;
	@ApiProperty({
		type: 'string',
	})
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	dateOfBirth: Date;
	@ApiProperty({
		type: 'string',
	})
	phoneNumber: string;
	@ApiProperty({
		type: 'string',
	})
	address: string;
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
		enum: userStatusEnum,
	})
	status: userStatusEnum;
}
