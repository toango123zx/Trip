import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AmenityStatusEnum, BedTypeStatusEnum, ProductStatusEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { CreateRoomTypeDto, ProductEntity, RoomTypeEntity } from 'src/models';
import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { AmenityRepository } from 'src/modules/amenity/amenity.repository';
import { BedTypeRepository } from 'src/modules/bedType/bedType.repository';
import { ProductRepository } from 'src/modules/product/product.repository';
import { RoomTypeRepository } from 'src/modules/roomType/roomType.repository';

import { CreateRoomTypeByProductIdCommand } from '../implements';

@CommandHandler(CreateRoomTypeByProductIdCommand)
export class CreateRoomTypeByProductIdHandler
	implements ICommandHandler<CreateRoomTypeByProductIdCommand>
{
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly amenityRepository: AmenityRepository,
		private readonly bedTypeRepository: BedTypeRepository,
		private readonly roomTypeRepository: RoomTypeRepository,
	) {}

	private checkSupplierPermissions(
		supplier: SupplierInformationDto,
		product: ProductEntity,
	): void | HttpException {
		if (
			!plainToInstance(
				SupplierInformationDto,
				supplier,
			).checkSupplierIsProductSupplier(product)
		) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not a product supplier.',
			);
		}
		return;
	}

	async execute(
		command: CreateRoomTypeByProductIdCommand,
	): Promise<HttpResponseBodySuccessDto<RoomTypeEntity> | HttpException> {
		const { productId, roomTypeInformationRequest, supplierInformation } = command;
		const product = await this.productRepository.findProductByProductId(
			productId,
			ProductStatusEnum.active,
		);
		if (!product) {
			throw new NotFoundException('productId');
		}

		if (!this.checkSupplierPermissions(supplierInformation, product)) {
			throw new ForbiddenException();
		}

		if (roomTypeInformationRequest.amenityIds.length !== 0) {
			const totalRecordsAmenity =
				await this.amenityRepository.findAmenitiesByAmenityIds(
					roomTypeInformationRequest.amenityIds || [],
					AmenityStatusEnum.active,
				)[1];
			if (
				totalRecordsAmenity === 0 &&
				totalRecordsAmenity !== roomTypeInformationRequest.amenityIds.length
			) {
				throw new NotFoundException('amenityId');
			}
		}
		const totalRecordsBedType = await this.bedTypeRepository.findBedTypesByBedTypeIds(
			roomTypeInformationRequest.bedTypes.map((bedType) => bedType.id) || [],
			BedTypeStatusEnum.active,
		)[1];
		if (
			totalRecordsBedType === 0 &&
			totalRecordsBedType !== roomTypeInformationRequest.bedTypes.length
		) {
			throw new NotFoundException('bedTypeId');
		}

		const roomType: CreateRoomTypeDto = {
			name: roomTypeInformationRequest.name,
			description: roomTypeInformationRequest.description,
			maxOccupancy: roomTypeInformationRequest.maxOccupancy,
			quantity: roomTypeInformationRequest.quantity,
			price: roomTypeInformationRequest.price,
			product: {
				connect: {
					id: productId,
				},
			},
			infoRoomTypeAmenity: {
				create:
					roomTypeInformationRequest.amenityIds.length === 0
						? []
						: roomTypeInformationRequest.amenityIds.map((amenityId) => ({
								amenity: {
									connect: {
										id: amenityId,
									},
								},
							})),
			},
			infoRoomTypeBedType: {
				create: roomTypeInformationRequest.bedTypes.map((bedType) => ({
					bedType: {
						connect: {
							id: bedType.id,
						},
					},
					quantity: bedType.quantity,
				})),
			},
		};

		const roomTypeInformation =
			await this.roomTypeRepository.createRoomTypeByProductId(productId, roomType);
		return {
			success: true,
			data: roomTypeInformation,
		};
	}
}
