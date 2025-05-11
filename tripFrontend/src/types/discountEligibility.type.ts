export enum EDiscountEligibilityStatus {
	active = 'active',
	inactive = 'inactive',
}

export type TDiscountEligibilitySumary = {
	id: string;
	name: string;
	description: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EDiscountEligibilityStatus;
};
