export enum EDiscountStatus {
	active = 'active',
	full = 'full',
	canceled = 'canceled',
}

export type TDiscountSumary = {
	id: string;
	name: string;
	productName: string;
	code: string;
	description: string;
	discountPercent: number;
	startTime: string;
	endTime: string;
	quantity: number;
	value: number;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EDiscountStatus;
};

export type TDiscountDetail = {
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
	deletedAt: Date | null;
	status: EDiscountStatus;
};
