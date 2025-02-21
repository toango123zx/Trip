import { ApiProperty } from '@nestjs/swagger';

import { productScheduleStatusEnum } from '@prisma/client';

import { CartEntity } from '../../cart/entities/cart.entity';
import { InfoBillEntity } from '../../info_bill/entities/info_bill.entity';
import { InfoDiscountEntity } from '../../info_discount/entities/info_discount.entity';
import { ProductEntity } from '../../product/entities/product.entity';

export class ProductScheduleEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	productId: string;
	@ApiProperty({
		type: () => ProductEntity,
		required: false,
	})
	product?: ProductEntity;
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
		enumName: 'productScheduleStatusEnum',
	})
	status: productScheduleStatusEnum;
	@ApiProperty({
		type: () => InfoBillEntity,
		isArray: true,
		required: false,
	})
	infoBill?: InfoBillEntity[];
	@ApiProperty({
		type: () => CartEntity,
		isArray: true,
		required: false,
	})
	cart?: CartEntity[];
	@ApiProperty({
		type: () => InfoDiscountEntity,
		isArray: true,
		required: false,
	})
	infoDiscount?: InfoDiscountEntity[];
}
