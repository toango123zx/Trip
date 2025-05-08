import { DiscountEntity } from 'src/models';

export class GetDiscountsByProductIdResponseDto {
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
		this.createAt = discount.createAt;
		this.updateAt = discount.updateAt;
		this.deletedAt = discount.deletedAt;
		this.status = discount.status;
	}
}
