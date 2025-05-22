import { ProductScheduleStatusEnum, ProductStatusEnum } from '@prisma/client';
import { CartEntity } from 'src/models';

export class GetCartResponseDto {
	id: string;
	userId: string;
	productScheduleId: string;
	scheduleId: string;
	startTime: Date;
	endTime: Date;
	price: number;
	booked: number;
	startOrder: Date;
	endOrder: Date;
	ProductScheduleStatus: ProductScheduleStatusEnum;
	product: {
		id: string;
		name: string;
		posterImageUrl: string;
		supplierId: string;
		time: number;
		quantityAvailable: number;
		age: number;
		quantityCompleted: number;
		description: string;
		quantityRate: number;
		avgRate: number;
		locationId: string;
		locationName: string;
		productCategoryId: string;
		productCategoryName: string;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date | null;
		status: ProductStatusEnum;
		supplier: {
			id: string;
			userId: string;
			name: string;
			image: string;
			status: string;
			taxId: string;
			fee: number;
		};
	};

	constructor(cart: CartEntity) {
		this.id = cart.id;
		this.userId = cart.userId;
		this.productScheduleId = cart.productScheduleId;
		this.scheduleId = cart.productSchedule.id;
		this.startTime = cart.productSchedule.startTime;
		this.endTime = cart.productSchedule.endTime;
		this.price = cart.productSchedule.price;
		this.booked = cart.productSchedule.booked;
		this.startOrder = cart.productSchedule.startOrder;
		this.endOrder = cart.productSchedule.endOrder;
		this.ProductScheduleStatus = cart.productSchedule.status;
		this.product = cart.productSchedule.product && {
			id: cart.productSchedule.product.id,
			name: cart.productSchedule.product.name,
			posterImageUrl: cart.productSchedule.product.posterImageUrl,
			supplierId: cart.productSchedule.product.supplierId,
			time: cart.productSchedule.product.time,
			quantityAvailable: cart.productSchedule.product.quantityAvailable,
			age: cart.productSchedule.product.age,
			quantityCompleted: cart.productSchedule.product.quantityCompleted,
			description: cart.productSchedule.product.description,
			quantityRate: cart.productSchedule.product.quantityRate,
			avgRate: cart.productSchedule.product.avgRate,
			locationId: cart.productSchedule.product.locationId,
			locationName: cart.productSchedule.product.location?.displayName,
			productCategoryId: cart.productSchedule.product.productCategoryId,
			productCategoryName: cart.productSchedule.product.productCategory?.name,
			createAt: cart.productSchedule.product.createAt,
			updateAt: cart.productSchedule.product.updateAt,
			deletedAt: cart.productSchedule.product.deletedAt,
			status: cart.productSchedule.product.status,
			supplier: {
				id: cart.productSchedule.product.supplier.id,
				userId: cart.productSchedule.product.supplier.userId,
				name: cart.productSchedule.product.supplier.user.name,
				image: cart.productSchedule.product.supplier.user.image,
				status: cart.productSchedule.product.supplier.user.status,
				taxId: cart.productSchedule.product.supplier.taxId,
				fee: cart.productSchedule.product.supplier.fee,
			},
		};
	}
}
