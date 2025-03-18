import { ApiProperty } from '@nestjs/swagger';

import { ProductStatusEnum } from '@prisma/client';

import { LocationEntity } from '../../location/entities/location.entity';
import { ProductCategoryEntity } from '../../product_category/entities/product_category.entity';
import { ProductImageEntity } from '../../product_image/entities/product_image.entity';
import { ProductRateEntity } from '../../product_rate/entities/product_rate.entity';
import { ProductScheduleEntity } from '../../product_schedule/entities/product_schedule.entity';
import { SupplierEntity } from '../../supplier/entities/supplier.entity';

export class ProductEntity {
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
	supplierId: string;
	@ApiProperty({
		type: () => SupplierEntity,
		required: false,
	})
	supplier?: SupplierEntity;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	time: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityAvailable: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	age: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityCompleted: number;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityRate: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	avgRate: number;
	@ApiProperty({
		type: 'string',
	})
	locationId: string;
	@ApiProperty({
		type: () => LocationEntity,
		required: false,
	})
	location?: LocationEntity;
	@ApiProperty({
		type: 'string',
	})
	productCategoryId: string;
	@ApiProperty({
		type: () => ProductCategoryEntity,
		required: false,
	})
	productCategory?: ProductCategoryEntity;
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
		enum: ProductStatusEnum,
		enumName: 'ProductStatusEnum',
	})
	status: ProductStatusEnum;
	@ApiProperty({
		type: () => ProductImageEntity,
		isArray: true,
		required: false,
	})
	productImage?: ProductImageEntity[];
	@ApiProperty({
		type: () => ProductRateEntity,
		isArray: true,
		required: false,
	})
	productRate?: ProductRateEntity[];
	@ApiProperty({
		type: () => ProductScheduleEntity,
		isArray: true,
		required: false,
	})
	productSchedule?: ProductScheduleEntity[];
}
