import { $Enums } from '@prisma/client';
import { PermissionEntity, RoleEntity } from 'src/models';

export class SupplierInformationDto {
	userId: string;
	supplierId: string;
	name: string;
	roleId: string;
	role?: RoleEntity;
	roleName?: string;
	image: string;
	gender: $Enums.GenderUserEnum;
	email: string;
	dateOfBirth: Date;
	phoneNumber: string;
	address: string;
	balance: number;
	point: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: $Enums.UserStatusEnum;
	permission?: PermissionEntity[];
	supplier: {
		id: string;
		fee: number;
		taxId: string;
	};
}
