import { DiscountApplicationScopeStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountEntity } from '../../discount/entities/discount.entity';

export class DiscountApplicationScopeEntity {
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
		enum: DiscountApplicationScopeStatusEnum,
		enumName: 'DiscountApplicationScopeStatusEnum',
	})
	status: DiscountApplicationScopeStatusEnum;
	@ApiProperty({
		type: () => DiscountEntity,
		isArray: true,
		required: false,
	})
	discount?: DiscountEntity[];
}
