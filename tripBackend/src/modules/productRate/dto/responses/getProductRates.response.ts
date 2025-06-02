import { GenderUserEnum, ProductRateStatusEnum } from '@prisma/client';
import { ProductRateEntity } from 'src/models';

export class GetProductRatesResponseDto {
	id: string;
	productId: string;
	star: number;
	comment: string;
	userId: string;
	userName: string;
	userImage: string;
	userGender: GenderUserEnum;
	createAt: Date;
	updateAt: Date;
	deleteAt: Date;
	status: ProductRateStatusEnum;

	constructor(productRate: ProductRateEntity) {
		this.id = productRate.id;
		this.productId = productRate.productId;
		this.star = productRate.star;
		this.comment = productRate.comment;
		this.userId = productRate.userId;
		this.userName = productRate.user?.name;
		this.userImage = productRate.user?.image;
		this.userGender = productRate.user?.gender;
		this.createAt = productRate.createAt;
		this.updateAt = productRate.updateAt;
		this.deleteAt = productRate.deletedAt;
		this.status = productRate.status;
	}
}
