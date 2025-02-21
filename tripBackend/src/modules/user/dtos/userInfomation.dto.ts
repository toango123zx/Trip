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
	accountExternal?: AccountExternalEntity;
	account?: AccountEntity;
	bill?: BillEntity[];
	cart?: CartEntity[];
	discount?: DiscountEntity[];
	boxChatMember?: BoxChatMemberEntity[];
	message?: MessageEntity[];
	permission?: PermissionEntity[];

	constructor(user: UserEntity) {
		this.id = user.id;
		this.name = user.name;
		this.roleId = user.roleId;
		this.role = user.role;
		this.roleName = user.role?.name;
		this.image = user.image;
		this.gender = user.gender;
		this.email = user.email;
		this.dateOfBirth = user.dateOfBirth;
		this.phoneNumber = user.phoneNumber;
		this.address = user.address;
		this.balance = user.balance;
		this.point = user.point;
		this.createAt = user.createAt;
		this.updateAt = user.updateAt;
		this.deletedAt = user.deletedAt;
		this.status = user.status;
		this.supplier = user.supplier;
		this.productRate = user.productRate;
		this.accountExternal = user.accountExternal;
		this.account = user.account;
		this.bill = user.bill;
		this.cart = user.cart;
		this.discount = user.discount;
		this.boxChatMember = user.boxChatMember;
		this.message = user.message;
		this.permission = user.role?.infoPermission?.map(
			(inforPermission) => inforPermission.permission,
		);
	}

	static constructorFromAccount(account: AccountEntity): UserInformationDto {
		const user: UserEntity = {
			...account.user,
		};
		return new UserInformationDto(user);
	}

	getUserInformation(): UserInformationDto {
		return {
			id: this.id,
			name: this.name,
			roleName: this.roleName,
			image: this.image,
			gender: this.gender,
			email: this.email,
			dateOfBirth: this.dateOfBirth,
			phoneNumber: this.phoneNumber,
			address: this.address,
			balance: this.balance,
			point: this.point,
			createAt: this.createAt,
			updateAt: this.updateAt,
			deletedAt: this.deletedAt,
			status: this.status,
			supplier: this.supplier,
		} as UserInformationDto;
	}
}
