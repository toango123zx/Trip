import { ApiProperty } from '@nestjs/swagger';

import { discountTypeStatusEnum } from '@prisma/client';

import { DiscountEntity } from '../../discount/entities/discount.entity';

export class DiscountTypeEntity {
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
	description: string;
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
		enum: discountTypeStatusEnum,
		enumName: 'discountTypeStatusEnum',
	})
	status: discountTypeStatusEnum;
	@ApiProperty({
		type: () => DiscountEntity,
		isArray: true,
		required: false,
	})
	discount?: DiscountEntity[];
}
