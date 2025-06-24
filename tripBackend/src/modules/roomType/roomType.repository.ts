import { Injectable } from '@nestjs/common';

import { CreateRoomTypeDto, RoomTypeEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class RoomTypeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createRoomTypeByProductId(
		productId: string,
		roomType: CreateRoomTypeDto,
	): Promise<RoomTypeEntity> {
		return this.prismaService.roomType.create({
			data: {
				product: {
					connect: {
						id: productId,
					},
				},
				...roomType,
			},
		});
	}
}
