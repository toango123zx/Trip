import { ApiProperty } from '@nestjs/swagger';

import { ProductStatusEnum } from '@prisma/client';

import { LocationEntity } from '../../location/entities/location.entity';
import { ProductCategoryEntity } from '../../productCategory/entities/productCategory.entity';
import { ProductImageEntity } from '../../productImage/entities/productImage.entity';
import { ProductRateEntity } from '../../productRate/entities/productRate.entity';
import { ProductScheduleEntity } from '../../productSchedule/entities/productSchedule.entity';
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
		minimum: 0.01,
		type: 'integer',
		format: 'int32',
	})
	time: number;
	@ApiProperty({
		minimum: 1,
		type: 'integer',
		format: 'int32',
	})
	quantityAvailable: number;
	@ApiProperty({
		minimum: 0,
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
