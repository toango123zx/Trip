import { $Enums } from '@prisma/client';
import {
	AccountEntity,
	AccountExternalEntity,
	BillEntity,
	BoxChatMemberEntity,
	CartEntity,
	DiscountEntity,
	MessageEntity,
	PermissionEntity,
	ProductRateEntity,
	RoleEntity,
	SupplierEntity,
	UserEntity,
} from 'src/models';

export class UserInformationDto implements UserEntity {
	id: string;
	name: string;
	roleId: string;
	role?: RoleEntity;
	roleName?: string;
	image: string;
	gender: $Enums.genderUserEnum;
	email: string;
	dateOfBirth: Date;
	phoneNumber: string;
	address: string;
	balance: number;
	point: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: $Enums.userStatusEnum;
	supplier?: SupplierEntity;
	productRate?: ProductRateEntity[];
	accountExternal?: AccountExternalEntity[];
	account?: AccountEntity[];
	bill?: BillEntity[];
	cart?: CartEntity[];
	discount?: DiscountEntity[];
	boxChatMember?: BoxChatMemberEntity[];
	message?: MessageEntity[];
	permission?: PermissionEntity[];
}
