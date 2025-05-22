import { ProductEntity } from 'src/models';

import { GetProductsResponseDto } from './getProducts.response';

export class GetProductByProductIdResponseDto extends GetProductsResponseDto {
	productImage: {
		id: string;
		url: string;
	}[];

	mapAddress: {
		id: string;
		url: string;
		providerMap: string;
		status: string;
	};

	productSchedule: {
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
	}[];

	productRate: {
		id: string;
		userId: string;
		userName: string;
		userImage: string;
		star: number;
		comment: string;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date;
		status: string;
	}[];

	constructor(product: ProductEntity) {
		super(product);
		this.productImage = product.productImage.map((image) => ({
			id: image.id,
			url: image.url,
		}));

		this.mapAddress = {
			id: product.mapAddress.id,
			url: product.mapAddress.urlMap,
			providerMap: product.mapAddress.providerMap.name,
			status: product.mapAddress.status,
		};

		this.productSchedule = product.productSchedule.map((schedule) => ({
			id: schedule.id,
			startTime: schedule.startTime,
			endTime: schedule.endTime,
			price: schedule.price,
			booked: schedule.booked,
			startOrder: schedule.startOrder,
			endOrder: schedule.endOrder,
			createAt: schedule.createAt,
			updateAt: schedule.updateAt,
			deletedAt: schedule.deletedAt,
			status: schedule.status,
		}));

		this.productRate = product.productRate.map((rate) => ({
			id: rate.id,
			userId: rate.user?.id,
			userName: rate.user?.name,
			userImage: rate.user?.image,
			star: rate.star,
			comment: rate.comment,
			createAt: rate.createAt,
			updateAt: rate.updateAt,
			deletedAt: rate.deletedAt,
			status: rate.status,
		}));
	}
}
