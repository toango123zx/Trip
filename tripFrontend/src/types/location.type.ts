export enum ELocationStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
}

type TMapAddress = {
	id: string;
	urlMap: string;
	provider: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: string;
};

export type TLocation = {
	id: string;
	systemName: string;
	displayName: string;
	city: string;
	mapAddress: TMapAddress;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: ELocationStatus;
};
