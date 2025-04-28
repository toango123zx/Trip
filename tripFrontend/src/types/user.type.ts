export enum EUserStatus {
	active = 'active',
	locked = 'locked',
	inactive = 'inactive',
}

export enum EUserRole {
	admin = 'admin',
	supplier = 'supplier',
	tourist = 'tourist',
}

export type TUser = {
	id: string;
	name: string;
	roleName: EUserRole;
	image: string;
	gender: string | null;
	email: string;
	dateOfBirth: Date | null;
	phoneNumber: string | null;
	address: string | null;
	balance: number;
	point: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: EUserStatus;
	supplier?: TSupplier;
};

export type TSupplier = {
	id: string;
	taxId: string;
	fee: number;
};
