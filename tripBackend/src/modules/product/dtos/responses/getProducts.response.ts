import { AmenityStatusEnum } from '@prisma/client';
import { ProductCategoryEnum } from 'src/common';
import { ProductEntity } from 'src/models';

export class GetProductsResponseDto {
	id: string;
	name: string;
	posterImageUrl: string;
	time: number;
	quantityAvailable: number;
	age: number;
	quantityCompleted: number;
	description: string;
	quantityRate: number;
	avgRate: number;
	productCategoryName: string;
	locationName: string;
	city: string;
	supplier: {
		id: string;
		userId: string;
		name: string;
		email?: string;
		phoneNumber?: string;
		address?: string;
		image: string;
		status: string;
	};
	schedule?: {
		id: string;
		startTime: Date;
		endTime: Date;
		price: number;
		booked: number;
		startOrder: Date;
		endOrder: Date;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date;
		status: string;
	};
	discount?: {
		id: string;
		name: string;
		code: string;
		description: string;
		startTime: Date;
		endTime: Date;
		value: number;
		quantity: number;
		point: number;
		applited: number;
		stackable: boolean;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date;
		status: string;
	};
	roomType?: {
		id: string;
		name: string;
		description: string;
		maxOccupancy: number;
		quantity: number;
		price: number;
		amenities?: {
			id: string;
			name: string;
			description: string;
			status: AmenityStatusEnum;
		}[];
		bedTypes: {
			id: string;
			name: string;
			description: string;
			quantity: number;
			status: string;
		}[];
	}[];
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: string;

	constructor(product: ProductEntity) {
		this.id = product.id;
		this.name = product.name;
		this.posterImageUrl = product.posterImageUrl;
		this.time = product.time;
		this.quantityAvailable = product.quantityAvailable;
		this.age = product.age;
		this.quantityCompleted = product.quantityCompleted;
		this.description = product.description;
		this.quantityRate = product.quantityRate;
		this.avgRate = product.avgRate;
		this.productCategoryName = product.productCategory.name;
		this.locationName = product.location.displayName;
		this.city = product.location.country;
		this.supplier = {
			id: product.supplier.id,
			userId: product.supplier.user.id,
			name: product.supplier.user.name,
			email: product.supplier?.user?.email,
			phoneNumber: product.supplier?.user?.phoneNumber,
			address: product.supplier?.user?.address,
			image: product.supplier.user.image,
			status: product.supplier.user.status,
		};
		this.schedule =
			product.productCategory.name === ProductCategoryEnum.accommodation &&
			product.productSchedule &&
			product.productSchedule.length > 0
				? {
						id: product.productSchedule[0].id,
						startTime: product.productSchedule[0].startTime,
						endTime: product.productSchedule[0].endTime,
						price: product.productSchedule[0].price,
						booked: product.productSchedule[0].booked,
						startOrder: product.productSchedule[0].startOrder,
						endOrder: product.productSchedule[0].endOrder,
						createAt: product.productSchedule[0].createAt,
						updateAt: product.productSchedule[0].updateAt,
						deletedAt: product.productSchedule[0].deletedAt,
						status: product.productSchedule[0].status,
					}
				: undefined;
		this.discount =
			product.productCategory.name === ProductCategoryEnum.accommodation &&
			product.productSchedule &&
			product.productSchedule.length > 0 &&
			product.productSchedule[0].infoDiscount &&
			product.productSchedule[0].infoDiscount.length > 0
				? {
						id: product.productSchedule[0].infoDiscount[0].discount.id,
						name: product.productSchedule[0].infoDiscount[0].discount.name,
						code: product.productSchedule[0].infoDiscount[0].discount.code,
						description:
							product.productSchedule[0].infoDiscount[0].discount
								.description,
						startTime:
							product.productSchedule[0].infoDiscount[0].discount.startTime,
						endTime:
							product.productSchedule[0].infoDiscount[0].discount.endTime,
						value: product.productSchedule[0].infoDiscount[0].discount.value,
						quantity:
							product.productSchedule[0].infoDiscount[0].discount.quantity,
						point: product.productSchedule[0].infoDiscount[0].discount.point,
						applited:
							product.productSchedule[0].infoDiscount[0].discount.applited,
						stackable:
							product.productSchedule[0].infoDiscount[0].discount.stackable,
						createAt:
							product.productSchedule[0].infoDiscount[0].discount.createAt,
						updateAt:
							product.productSchedule[0].infoDiscount[0].discount.updateAt,
						deletedAt:
							product.productSchedule[0].infoDiscount[0].discount.deletedAt,
						status: product.productSchedule[0].infoDiscount[0].discount
							.status,
					}
				: undefined;
		this.roomType =
			product.productCategory.name === ProductCategoryEnum.accommodation &&
			product.roomType.length > 0
				? product.roomType.map((roomType) => ({
						id: roomType.id,
						name: roomType.name,
						description: roomType.description,
						maxOccupancy: roomType.maxOccupancy,
						quantity: roomType.quantity,
						price: roomType.price,
						amenities: roomType.infoRoomTypeAmenity
							? roomType.infoRoomTypeAmenity.map((infoRoomTypeAmenity) => ({
									id: infoRoomTypeAmenity.amenity?.id,
									name: infoRoomTypeAmenity.amenity?.name,
									description: infoRoomTypeAmenity.amenity?.description,
									status: infoRoomTypeAmenity.amenity?.status,
								}))
							: [],
						bedTypes: roomType.infoRoomTypeBedType
							? roomType.infoRoomTypeBedType.map((infoRoomTypeBedType) => ({
									id: infoRoomTypeBedType.bedType?.id,
									name: infoRoomTypeBedType.bedType?.name,
									description: infoRoomTypeBedType.bedType?.description,
									quantity: infoRoomTypeBedType?.quantity,
									status: infoRoomTypeBedType.bedType?.status,
								}))
							: [],
					}))
				: undefined;
		this.createAt = product.createAt;
		this.updateAt = product.updateAt;
		this.deletedAt = product.deletedAt;
		this.status = product.status;
	}
}
