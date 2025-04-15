import { ProductEntity } from 'src/models';

export class GetProductsResponseDto {
	id: string;
	name: string;
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
		satus: string;
	};
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: string;

	constructor(product: ProductEntity) {
		this.id = product.id;
		this.name = product.name;
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
			satus: product.supplier.user.status,
		};
		this.createAt = product.createAt;
		this.updateAt = product.updateAt;
		this.deletedAt = product.deletedAt;
		this.status = product.status;
	}
}
