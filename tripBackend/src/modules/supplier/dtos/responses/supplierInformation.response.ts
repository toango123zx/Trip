import { $Enums } from '@prisma/client';
import { AccountEntity, PermissionEntity, RoleEntity, UserEntity } from 'src/models';

export class SupplierInformationResponseDto {
	userId: string;
	supplierId: string;
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
	taxId: string;
	balance: number;
	point: number;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date;
	status: $Enums.userStatusEnum;
	permission?: PermissionEntity[];

	constructor(user: UserEntity) {
		this.userId = user.id;
		this.supplierId = user.supplier?.id;
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
		this.taxId = user.supplier?.taxId;
		this.balance = user.balance;
		this.point = user.point;
		this.createAt = user.createAt;
		this.updateAt = user.updateAt;
		this.deletedAt = user.deletedAt;
		this.status = user.status;
		this.permission = user.role?.infoPermission?.map(
			(inforPermission) => inforPermission.permission,
		);
	}

	static constructorFromAccount(
		account: AccountEntity,
	): SupplierInformationResponseDto {
		const user: UserEntity = {
			...account.user,
		};
		return new SupplierInformationResponseDto(user);
	}

	getSupplierInformation(): SupplierInformationResponseDto {
		return {
			userId: this.userId,
			supplierId: this.supplierId,
			name: this.name,
			roleName: this.roleName,
			image: this.image,
			gender: this.gender,
			email: this.email,
			dateOfBirth: this.dateOfBirth,
			phoneNumber: this.phoneNumber,
			address: this.address,
			taxId: this.taxId,
			balance: this.balance,
			point: this.point,
			createAt: this.createAt,
			updateAt: this.updateAt,
			deletedAt: this.deletedAt,
			status: this.status,
		} as SupplierInformationResponseDto;
	}
}
