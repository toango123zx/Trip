import { EDiscountStatus } from './discount.type';
import { EProductScheduleStatus, EProductStatus } from './product.type';
import { EUserStatus } from './user.type';

export enum EBillStatus {
	done = 'done',
	paid = 'paid',
	pending = 'pending',
	cancel = 'cancel',
	refunded = 'refunded',
	waitingRefund = 'waitingRefund',
}

export enum ETransactionTarget {
	deposit = 'deposit',
	withdrawal = 'withdrawal',
	pay = 'pay',
	refund = 'refund',
}
export enum ETransactionStatus {
	pending = 'pending',
	completed = 'completed',
	canceled = 'canceled',
}

export type TBillSumary = {
	id: string;
	userId: string;
	paymentMethodId: string;
	transactionTargetId: string;
	reductionPrice: number;
	totalPrice: number;
	createAt: Date; // ISO timestamp
	updateAt: Date; // ISO timestamp
	deletedAt: Date | null; // null if not deleted
	status: EBillStatus;
};

export type TBill = {
	id: string;
	userId: string;
	paymentMethodId: string;
	transactionTargetId: string;
	reductionPrice: number;
	totalPrice: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EBillStatus;
	infoBill: TInfoBillItem[];
	infoBillDiscount: TInfoBillDiscountItem[];
	discountForBill: TDiscountForBillItem[];
	paymentMethod: TPaymentMethod;
	transaction: TTransaction;
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
		status: EUserStatus;
	};
};

type TInfoBillItem = {
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
	productScheduleStatus: string;
	isRated: boolean;
	product: TProduct;
};

type TProduct = {
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
	status: EProductStatus;
	supplier: {
		id: string;
		userId: string;
		name: string;
		image: string;
		status: EUserStatus;
	};
	productCategory: {
		id: string;
		name: string;
	};
};

type TInfoBillDiscountItem = {
	id: string;
	discountId: string;
	discount: TDiscountWithInfo;
};

type TDiscountWithInfo = TDiscount & {
	infoDiscount: TInfoDiscountItem[];
};

type TInfoDiscountItem = {
	id: string;
	discountId: string;
	productScheduleId: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EDiscountStatus;
	productSchedule: TProductSchedule;
};

type TProductSchedule = {
	id: string;
	productScheduleStatus: string;
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
	status: EProductScheduleStatus;
};

type TDiscountForBillItem = {
	id: string;
	billId: string;
	discountId: string;
	discount: TDiscount;
};

type TDiscount = {
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
	status: EDiscountStatus;
};

export type TPaymentMethod = {
	id: string;
	name: string;
	description: string;
	status: string;
};

export type TTransaction = {
	id: string;
	code: string;
	description: string;
	transactionTarget: ETransactionTarget;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: ETransactionStatus;
};
