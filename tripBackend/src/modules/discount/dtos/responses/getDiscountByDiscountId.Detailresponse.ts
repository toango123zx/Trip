import {
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
	UserStatusEnum,
} from '@prisma/client';
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
	supplier: {
		id: string;
		userId: string;
		name: string;
		image: string;
		email: string;
		phoneNumber: string | null;
		status: UserStatusEnum;
	};
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

export class GetDiscountByDiscountIdResponseDto {
	id: string;
	name: string;
	discountProviderType: string;
	userId: string;
	code: string;
	description: string;
	startTime: Date;
	endTime: Date;
	value: number;
	quantity: number;
	point: number;
	applited: number;
	stackable: boolean;
	discountType: {
		id: string;
		name: string;
	};
	discountEligibility: {
		id: string;
		name: string;
	};
	discountApplicationScope: {
		id: string;
		name: string;
	};
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: string;
	user: {
		id: string;
		name: string;
		image: string;
		email: string;
		phoneNumber: string | null;
	};
	infoDiscount: infoDiscount[];

	constructor(discount: DiscountEntity) {
		this.id = discount.id;
		this.name = discount.name;
		this.discountProviderType = discount.discountProviderType;
		this.userId = discount.userId;
		this.code = discount.code;
		this.description = discount.description;
		this.startTime = discount.startTime;
		this.endTime = discount.endTime;
		this.value = discount.value;
		this.quantity = discount.quantity;
		this.point = discount.point;
		this.applited = discount.applited;
		this.stackable = discount.stackable;
		this.discountType = {
			id: discount.discountType.id,
			name: discount.discountType.name,
		};
		this.discountEligibility = {
			id: discount.discountEligibility.id,
			name: discount.discountEligibility.name,
		};
		this.discountApplicationScope = {
			id: discount.discountApplicationScope.id,
			name: discount.discountApplicationScope.name,
		};
		this.createAt = discount.createAt;
		this.updateAt = discount.updateAt;
		this.deletedAt = discount.deletedAt;
		this.status = discount.status;

		this.user = {
			id: discount.user.id,
			name: discount.user.name,
			image: discount.user.image,
			email: discount.user.email,
			phoneNumber: discount.user.phoneNumber,
		};

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
				supplier: {
					id: info.productSchedule.product.supplier.id,
					userId: info.productSchedule.product.supplier.userId,
					name: info.productSchedule.product.supplier.user.name,
					image: info.productSchedule.product.supplier.user.image,
					email: info.productSchedule.product.supplier.user.email,
					phoneNumber: info.productSchedule.product.supplier.user.phoneNumber,
					status: info.productSchedule.product.supplier.user.status,
				},
			},
		}));
	}
}
