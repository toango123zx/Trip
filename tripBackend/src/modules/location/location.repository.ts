import { Injectable } from '@nestjs/common';

import { LocationStatusEnum } from '@prisma/client';
import { LocationEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class LocationRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findLocationByLocationId(
		locationId: string,
		locationStatus?: LocationStatusEnum,
	): Promise<LocationEntity> {
		return this.prismaService.location.findFirst({
			where: {
				id: locationId,
				status: locationStatus,
			},
		});
	}
}
