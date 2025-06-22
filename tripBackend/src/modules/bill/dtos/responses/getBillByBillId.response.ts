import {
	ProductScheduleStatusEnum,
	ProductStatusEnum,
	UserStatusEnum,
	DiscountStatusEnum,
	InfoDiscountStatusEnum,
	BillStatusEnum,
} from '@prisma/client';
import { DiscountApplicationScopeEnum } from 'src/common';
import {
	BillEntity,
	InfoBillEntity,
	InfoBillDiscountEntity,
	DiscountForBillEntity,
	ProductScheduleEntity,
	DiscountEntity,
} from 'src/models';

class InfoBillItem {
	id: string;
	productScheduleId: string;
	quantity: number;
	productId: string;
	productName: string;
	startTime: Date;
	endTime: Date;
	price: number;
	booked: number;
	startOrder: Date;
	endOrder: Date;
	totalPrice: number;
	reduction: number;
	paymentPrice: number;
	productScheduleStatus: ProductScheduleStatusEnum;
	isRated: boolean;
	product:
		| {
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
				createAt: Date;
				updateAt: Date;
				deletedAt: Date | null;
				status: ProductStatusEnum;
				supplier: {
					id: string;
					userId: string;
					name: string;
					image: string;
					status: UserStatusEnum;
				};
				productCategory: {
					id: string;
					name: string;
				};
		  }
		| undefined;
}

class InfoBillDiscountItem {
	id: string;
	discountId: string;
	discount: Discount;
}

class DiscountForBillItem {
	id: string;
	discountId: string;
	discount: Discount;
}

class Discount {
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
	discountTypeId: string;
	discountEligibilityId: string;
	discountApplicationScopeId: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: DiscountStatusEnum;
	infoDiscount?: infoDiscount[];
}

class infoDiscount {
	id: string;
	discountId: string;
	productScheduleId: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: InfoDiscountStatusEnum;
	productSchedule: {
		id: string;
		productScheduleStatus?: ProductScheduleStatusEnum;
		productId?: string;
		startTime?: Date;
		endTime?: Date;
		price?: number;
		booked?: number;
		startOrder?: Date;
		endOrder?: Date;
		createAt?: Date;
		updateAt?: Date;
		deletedAt?: Date;
		status?: ProductScheduleStatusEnum;
	};
}

class BillInfo {
	quantity: number;
	scheduleId: string;
	totalPrice: number;
	reduction: number;
	paymentPrice: number;
}

const calculateBillInfo = (
	schedules: { schedule: ProductScheduleEntity; quantity: number }[],
	discounts: DiscountEntity[],
): BillInfo[] => {
	// 1. Split discounts thành bill-level và per-schedule
	const billDiscounts: DiscountEntity[] = [];
	const schedDiscMap: Record<string, DiscountEntity[]> = {};

	for (const d of discounts) {
		if (d.discountApplicationScope.name === DiscountApplicationScopeEnum.Bill) {
			billDiscounts.push(d);
		} else {
			// ✅ FIX: Check if infoDiscount exists and is an array
			if (d.infoDiscount && Array.isArray(d.infoDiscount)) {
				for (const { id } of d.infoDiscount) {
					if (!schedDiscMap[id]) schedDiscMap[id] = [];
					schedDiscMap[id]!.push(d);
				}
			}
		}
	}

	// 2. Helper để tính reduction cho 1 dòng
	function applyDiscounts(
		ds: DiscountEntity[],
		baseAmount: number,
		qty: number = 1,
	): number {
		let stackableSum = 0;
		let nonStackableMax = 0;

		for (const d of ds) {
			const amt =
				d.discountType.name === 'Percentage'
					? baseAmount * (d.value / 100)
					: d.value * qty;

			if (d.stackable) {
				stackableSum += amt;
			} else {
				nonStackableMax = Math.max(nonStackableMax, amt);
			}
		}

		return stackableSum + nonStackableMax;
	}

	// 3. Chỉ build mảng BillInfo
	return schedules.map(({ schedule, quantity }) => {
		const totalPriceItem = schedule.price * quantity;
		const schedDs = schedDiscMap[schedule.id] || [];
		const reduction = applyDiscounts(schedDs, totalPriceItem, quantity);

		return {
			scheduleId: schedule.id,
			quantity,
			totalPrice: totalPriceItem,
			reduction,
			paymentPrice: totalPriceItem - reduction,
		};
	});
};

export class BillDetailResponseDto {
	id: string;
	userId: string;
	transactionTargetId: string;
	reductionPrice: number;
	totalPrice: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: BillStatusEnum;
	infoBill: InfoBillItem[] | [] | undefined;
	infoBillDiscount: InfoBillDiscountItem[];
	discountForBill: DiscountForBillItem[];
	user: {
		id: string;
		name: string;
		image: string;
		email: string;
		dateOfBirth: Date | null;
		phoneNumber: string | null;
		address: string | null;
		balance: number;
		point: number;
		status: UserStatusEnum;
	};
	withdrawal: {
		bankName: string;
		bankCode: string;
		amount: number;
	} | null;

	constructor(bill: BillEntity) {
		const s = bill.infoBill.map((item) => ({
			schedule: item.productSchedule,
			quantity: item.quantity,
		}));
		const d = [
			...bill.infoBillDiscount.map((item) => item.discount),
			...bill.discountForBill.map((item) => item.discount),
		];

		const ib = calculateBillInfo(s, d);

		this.id = bill.id;
		this.userId = bill.userId;
		this.transactionTargetId = bill.transactionTargetId;
		this.reductionPrice = bill.reductionPrice;
		this.totalPrice = bill.totalPrice;
		this.createAt = new Date(bill.createAt);
		this.updateAt = new Date(bill.updateAt);
		this.deletedAt = bill.deletedAt ? new Date(bill.deletedAt) : null;
		this.status = bill.status;
		this.infoBill =
			bill.infoBill?.map((infoBillDetail: InfoBillEntity) => ({
				id: infoBillDetail.id,
				productScheduleId: infoBillDetail.productScheduleId,
				quantity: infoBillDetail.quantity,
				productId: infoBillDetail.productSchedule?.productId,
				productName: infoBillDetail.productSchedule?.product?.id,
				startTime: infoBillDetail.productSchedule?.startTime,
				endTime: infoBillDetail.productSchedule?.endTime,
				price: infoBillDetail.productSchedule?.price,
				booked: infoBillDetail.productSchedule?.booked,
				startOrder: infoBillDetail.productSchedule?.startOrder,
				endOrder: infoBillDetail.productSchedule?.endOrder,
				totalPrice: ib.find(
					(item) => item.scheduleId === infoBillDetail.productScheduleId,
				)?.totalPrice,
				reduction: ib.find(
					(item) => item.scheduleId === infoBillDetail.productScheduleId,
				)?.reduction,
				paymentPrice: ib.find(
					(item) => item.scheduleId === infoBillDetail.productScheduleId,
				)?.paymentPrice,
				productScheduleStatus: infoBillDetail.productSchedule?.status,
				// isRated: infoBillDetail.productSchedule?.product?.productRate?.find(
				// 	(rate) =>
				// 		rate.userId === bill.userId && rate.createAt > bill.createAt,
				// )
				// 	? true
				// 	: false,
				isRated: infoBillDetail.productRate ? true : false,
				product: infoBillDetail.productSchedule.product && {
					id: infoBillDetail.productSchedule.product.id,
					name: infoBillDetail.productSchedule.product.name,
					posterImageUrl: infoBillDetail.productSchedule.product.posterImageUrl,
					supplierId: infoBillDetail.productSchedule.product.supplierId,
					time: infoBillDetail.productSchedule.product.time,
					quantityAvailable:
						infoBillDetail.productSchedule.product.quantityAvailable,
					age: infoBillDetail.productSchedule.product.age,
					quantityCompleted:
						infoBillDetail.productSchedule.product.quantityCompleted,
					description: infoBillDetail.productSchedule.product.description,
					quantityRate: infoBillDetail.productSchedule.product.quantityRate,
					avgRate: infoBillDetail.productSchedule.product.avgRate,
					locationId: infoBillDetail.productSchedule.product.locationId,
					locationName:
						infoBillDetail.productSchedule.product.location?.displayName,
					productCategoryId:
						infoBillDetail.productSchedule.product.productCategoryId,
					createAt: infoBillDetail.productSchedule.product.createAt,
					updateAt: infoBillDetail.productSchedule.product.updateAt,
					deletedAt: infoBillDetail.productSchedule.product.deletedAt || null,
					status: infoBillDetail.productSchedule.product.status,
					supplier: infoBillDetail.productSchedule.product.supplier && {
						id: infoBillDetail.productSchedule.product.supplierId,
						userId: infoBillDetail.productSchedule.product.supplier.userId,
						name: infoBillDetail.productSchedule.product.supplier.user?.name,
						image: infoBillDetail.productSchedule.product.supplier.user
							?.image,
						status: infoBillDetail.productSchedule.product.supplier.user
							?.status,
					},
					productCategory: infoBillDetail.productSchedule.product
						.productCategory && {
						id: infoBillDetail.productSchedule.product.productCategory.id,
						name: infoBillDetail.productSchedule.product.productCategory.name,
					},
				},
			})) || [];

		this.infoBillDiscount =
			bill.infoBillDiscount?.map(
				(infoBillDiscountDetail: InfoBillDiscountEntity) => ({
					id: infoBillDiscountDetail.id,
					discountId: infoBillDiscountDetail.discountId,

					discount: infoBillDiscountDetail.discount && {
						id: infoBillDiscountDetail.discount.id,
						name: infoBillDiscountDetail.discount.name,
						discountProviderType:
							infoBillDiscountDetail.discount.discountProviderType,
						userId: infoBillDiscountDetail.discount.userId,
						code: infoBillDiscountDetail.discount.code,
						description: infoBillDiscountDetail.discount.description,
						startTime: infoBillDiscountDetail.discount.startTime,
						endTime: infoBillDiscountDetail.discount.endTime,
						value: infoBillDiscountDetail.discount.value,
						quantity: infoBillDiscountDetail.discount.quantity,
						point: infoBillDiscountDetail.discount.point,
						applited: infoBillDiscountDetail.discount.applited,
						stackable: infoBillDiscountDetail.discount.stackable,
						discountTypeId: infoBillDiscountDetail.discount.discountTypeId,
						discountEligibilityId:
							infoBillDiscountDetail.discount.discountEligibilityId,
						discountApplicationScopeId:
							infoBillDiscountDetail.discount.discountApplicationScopeId,
						createAt: infoBillDiscountDetail.discount.createAt,
						updateAt: infoBillDiscountDetail.discount.updateAt,
						deletedAt: infoBillDiscountDetail.discount.deletedAt || null,
						status: infoBillDiscountDetail.discount.status,
						infoDiscount:
							infoBillDiscountDetail.discount.infoDiscount?.map(
								(infoDiscountItem) => ({
									id: infoDiscountItem.id,
									discountId: infoBillDiscountDetail.discount.id,
									productScheduleId: infoDiscountItem.productScheduleId,
									createAt: infoDiscountItem.createAt,
									updateAt: infoDiscountItem.updateAt,
									deletedAt: infoDiscountItem.deletedAt || null,
									status: infoDiscountItem.status,
									productSchedule: infoDiscountItem.productSchedule && {
										id: infoDiscountItem.productScheduleId,
										productScheduleStatus:
											infoDiscountItem.productSchedule.status,
										productId:
											infoDiscountItem.productSchedule.productId,
										startTime:
											infoDiscountItem.productSchedule.startTime,
										endTime: infoDiscountItem.productSchedule.endTime,
										price: infoDiscountItem.productSchedule.price,
										booked: infoDiscountItem.productSchedule.booked,
										startOrder:
											infoDiscountItem.productSchedule.startOrder,
										endOrder:
											infoDiscountItem.productSchedule.endOrder,
										createAt:
											infoDiscountItem.productSchedule.createAt,
										updateAt:
											infoDiscountItem.productSchedule.updateAt,
										deletedAt:
											infoDiscountItem.productSchedule.deletedAt,
										status: infoDiscountItem.productSchedule.status,
									},
								}),
							) || [],
					},
				}),
			) || [];
		this.discountForBill =
			bill.discountForBill?.map((dfb: DiscountForBillEntity) => ({
				id: dfb.id,
				billId: dfb.billId,
				discountId: dfb.discountId,
				discount: dfb.discount && {
					id: dfb.discount.id,
					name: dfb.discount.name,
					discountProviderType: dfb.discount.discountProviderType,
					userId: dfb.discount.userId,
					code: dfb.discount.code,
					description: dfb.discount.description,
					startTime: new Date(dfb.discount.startTime),
					endTime: new Date(dfb.discount.endTime),
					value: dfb.discount.value,
					quantity: dfb.discount.quantity,
					point: dfb.discount.point,
					applited: dfb.discount.applited,
					stackable: dfb.discount.stackable,
					discountTypeId: dfb.discount.discountTypeId,
					discountEligibilityId: dfb.discount.discountEligibilityId,
					discountApplicationScopeId: dfb.discount.discountApplicationScopeId,
					createAt: new Date(dfb.discount.createAt),
					updateAt: new Date(dfb.discount.updateAt),
					deletedAt: dfb.discount.deletedAt
						? new Date(dfb.discount.deletedAt)
						: null,
					status: dfb.discount.status,
				},
			})) || [];

		this.user = {
			id: bill.user.id,
			name: bill.user.name,
			image: bill.user.image,
			email: bill.user.email,
			dateOfBirth: bill.user.dateOfBirth,
			phoneNumber: bill.user.phoneNumber,
			address: bill.user.address,
			balance: bill.user.balance,
			point: bill.user.point,
			status: bill.user.status,
		};
		this.withdrawal = bill.BillWithdrawalInfo
			? {
					bankName: bill.BillWithdrawalInfo[0]?.bankName,
					bankCode: bill.BillWithdrawalInfo[0]?.bankCode,
					amount: Number(bill.BillWithdrawalInfo[0]?.amount),
				}
			: null;
	}
}
