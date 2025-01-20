import { productScheduleStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductScheduleDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	endTime: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	price: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	booked: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	startOrder: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	endOrder: Date;
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
		enum: productScheduleStatusEnum,
	})
	status: productScheduleStatusEnum;
}
