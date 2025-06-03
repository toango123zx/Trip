import { InfoDiscountStatusEnum, ProductScheduleStatusEnum } from '@prisma/client';
import { DiscountEntity } from 'src/models';

class productSchedule {
	id: string;
	productId: string;
	productName: string;
	productPosterImageUrl: string;
	productTime: number;
	productRate: number;
	productAge: number;
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
}

class infoDiscount {
	id: string;
	discountId: string;
	productScheduleId: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: InfoDiscountStatusEnum;
	productSchedule: productSchedule;
}

export class GetDiscountsResponseDto {
	id: string;
	name: string;
	user: {
		id: string;
		name: string;
	};
	code: string;
	description: string;
	startTime: Date;
	endTime: Date;
	value: number;
	quantity: number;
	point: number;
	applited: number;
	stackable: boolean;
	infoDiscount: infoDiscount[];
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: string;

	constructor(discount: DiscountEntity) {
		this.id = discount.id;
		this.name = discount.name;
		this.user = {
			id: discount.user?.id,
			name: discount.user?.name,
		};
		this.code = discount.code;
		this.description = discount.description;
		this.startTime = discount.startTime;
		this.endTime = discount.endTime;
		this.value = discount.value;
		this.quantity = discount.quantity;
		this.point = discount.point;
		this.applited = discount.applited;
		this.stackable = discount.stackable;
		this.infoDiscount = discount.infoDiscount?.map((info) => ({
			id: info.id,
			discountId: info.discountId,
			productScheduleId: info.productScheduleId,
			createAt: info.createAt,
			updateAt: info.updateAt,
			deletedAt: info.deletedAt,
			status: info.status,
			productSchedule: {
				id: info.productSchedule.id,
				productId: info.productSchedule.productId,
				productName: info.productSchedule.product.name,
				productPosterImageUrl: info.productSchedule.product.posterImageUrl,
				productTime: info.productSchedule.product.time,
				productRate: info.productSchedule.product.avgRate,
				productAge: info.productSchedule.product.age,
				startTime: info.productSchedule.startTime,
				endTime: info.productSchedule.endTime,
				price: info.productSchedule.price,
				booked: info.productSchedule.booked,
				startOrder: info.productSchedule.startOrder,
				endOrder: info.productSchedule.endOrder,
				createAt: info.productSchedule.createAt,
				updateAt: info.productSchedule.updateAt,
				deletedAt: info.productSchedule.deletedAt,
				status: info.productSchedule.status,
			},
		}));
		this.createAt = discount.createAt;
		this.updateAt = discount.updateAt;
		this.deletedAt = discount.deletedAt;
		this.status = discount.status;
	}
}
