export enum EDiscountApplicationScopeStatus {
	active = 'active',
	inactive = 'inactive',
}

export type TDiscountApplicationScopeSumary = {
	id: string;
	name: string;
	description: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EDiscountApplicationScopeStatus;
};
