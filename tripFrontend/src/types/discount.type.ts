export enum EDiscountStatus {
	active = 'active',
	full = 'full',
	canceled = 'canceled',
}

export type TDiscount = {
	id: string;
	name: string;
	productName: string;
	code: string;
	description: string;
	discountPercent: number;
	startDate: string;
	endDate: string;
	quantity: number;
	value: number;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EDiscountStatus;
};
