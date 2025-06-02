import { ProductScheduleStatusEnum, ProductStatusEnum } from '@prisma/client';
import { ProductScheduleEntity } from 'src/models';

export class GetProductScheduleDetailResponseDto {
	id: string;
	productId: string;
	startTime: Date;
	endTime: Date;
	price: number;
	booked: number;
	startOrder: Date;
	endOrder: Date;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: ProductScheduleStatusEnum;
	product: {
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
		locationName: string;
		productCategoryName: string;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date | null;
		status: ProductStatusEnum;
	};

	constructor(productSchedule: ProductScheduleEntity) {
		this.id = productSchedule.id;
		this.productId = productSchedule.productId;
		this.startTime = productSchedule.startTime;
		this.endTime = productSchedule.endTime;
		this.price = productSchedule.price;
		this.booked = productSchedule.booked;
		this.startOrder = productSchedule.startOrder;
		this.endOrder = productSchedule.endOrder;
		this.createAt = productSchedule.createAt;
		this.updateAt = productSchedule.updateAt;
		this.deletedAt = productSchedule.deletedAt;
		this.status = productSchedule.status;
		this.product = productSchedule.product
			? {
					id: productSchedule.product.id,
					name: productSchedule.product.name,
					posterImageUrl: productSchedule.product.posterImageUrl,
					time: productSchedule.product.time,
					quantityAvailable: productSchedule.product.quantityAvailable,
					age: productSchedule.product.age,
					quantityCompleted: productSchedule.product.quantityCompleted,
					description: productSchedule.product.description,
					quantityRate: productSchedule.product.quantityRate,
					avgRate: productSchedule.product.avgRate,
					locationName: productSchedule.product.location?.displayName,
					productCategoryName: productSchedule.product.productCategory?.name,
					createAt: productSchedule.product.createAt,
					updateAt: productSchedule.product.updateAt,
					deletedAt: productSchedule.product.deletedAt,
					status: productSchedule.product.status,
				}
			: undefined;
	}
}
