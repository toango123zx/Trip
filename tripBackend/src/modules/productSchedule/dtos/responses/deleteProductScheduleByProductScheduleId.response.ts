import { BillStatusEnum, ProductScheduleStatusEnum } from '@prisma/client';
import { ProductScheduleEntity } from 'src/models';

export class DeleteProductScheduleByProductScheduleIdResponseDto {
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
	bill: {
		id: string;
		userId: string;
		quantity: number;
		transactionTargetId: string;
		reductionPrice: number;
		totalPrice: number;
		createAt: Date;
		updateAt: Date;
		deletedAt: Date | null;
		status: BillStatusEnum;
	}[];

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
		this.deletedAt = productSchedule.deletedAt || null;
		this.status = productSchedule.status;
		this.bill =
			productSchedule.infoBill?.map((info) => ({
				id: info.bill.id,
				userId: info.bill.userId,
				quantity: info.quantity,
				transactionTargetId: info.bill.transactionTargetId,
				reductionPrice: info.bill.reductionPrice,
				totalPrice: info.bill.totalPrice,
				createAt: info.bill.createAt,
				updateAt: info.bill.updateAt,
				deletedAt: new Date(),
				status:
					info.bill.status === BillStatusEnum.paid
						? BillStatusEnum.waitingRefund
						: BillStatusEnum.cancel,
			})) || [];
	}
}
