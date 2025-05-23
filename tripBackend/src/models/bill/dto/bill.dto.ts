import { BillStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BillDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	transactionTargetId: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	reductionPrice: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	totalPrice: number;
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
		enum: BillStatusEnum,
		enumName: 'BillStatusEnum',
	})
	status: BillStatusEnum;
}
