export enum EDiscountTypeStatus {
	active = 'active',
	full = 'full',
	canceled = 'canceled',
}

export type TDiscountTypeSumary = {
	id: string;
	name: string;
	description: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EDiscountTypeStatus;
};
