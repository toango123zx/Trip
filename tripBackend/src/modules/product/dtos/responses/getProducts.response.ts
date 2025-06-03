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
		image: string;
		status: string;
	};
	schedule: {
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
	discount: {
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
		this.city = product.location.city;
		this.supplier = {
			id: product.supplier.id,
			userId: product.supplier.user.id,
			name: product.supplier.user.name,
			image: product.supplier.user.image,
			status: product.supplier.user.status,
		};
		this.schedule =
			product.productSchedule && product.productSchedule.length > 0
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
		this.createAt = product.createAt;
		this.updateAt = product.updateAt;
		this.deletedAt = product.deletedAt;
		this.status = product.status;
	}
}
