import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AmenityRepository } from '../amenity/amenity.repository';
import { AuthModule } from '../auth/auth.module';
import { BedTypeRepository } from '../bedType/bedType.repository';
import { DatabaseModule } from '../database/database.module';
import { ProductRepository } from '../product/product.repository';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { RoomTypeController } from './roomType.controller';
import { RoomTypeRepository } from './roomType.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [RoomTypeController],
	providers: [
		UserRepository,
		SupplierRepository,
		ProductRepository,
		BedTypeRepository,
		AmenityRepository,
		RoomTypeRepository,
	],
	exports: [],
})
export class RoomTypeModule {}
