import { GenderUserEnum, UserStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../role/entities/role.entity';
import { SupplierEntity } from '../../supplier/entities/supplier.entity';
import { ProductRateEntity } from '../../productRate/entities/productRate.entity';
import { AccountExternalEntity } from '../../accountExternal/entities/accountExternal.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { CartEntity } from '../../cart/entities/cart.entity';
import { DiscountEntity } from '../../discount/entities/discount.entity';
import { BoxChatMemberEntity } from '../../boxChatMember/entities/boxChatMember.entity';
import { MessageEntity } from '../../message/entities/message.entity';

export class UserEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	roleId: string;
	@ApiProperty({
		type: () => RoleEntity,
		required: false,
	})
	role?: RoleEntity;
	@ApiProperty({
		type: 'string',
	})
	image: string;
	@ApiProperty({
		enum: GenderUserEnum,
		enumName: 'GenderUserEnum',
		nullable: true,
	})
	gender: GenderUserEnum | null;
	@ApiProperty({
		type: 'string',
	})
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	dateOfBirth: Date | null;
	@ApiProperty({
		type: 'string',
		nullable: true,
	})
	phoneNumber: string | null;
	@ApiProperty({
		type: 'string',
		nullable: true,
	})
	address: string | null;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	balance: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	point: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updateAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	deletedAt: Date | null;
	@ApiProperty({
		enum: UserStatusEnum,
		enumName: 'UserStatusEnum',
	})
	status: UserStatusEnum;
	@ApiProperty({
		type: () => SupplierEntity,
		required: false,
		nullable: true,
	})
	supplier?: SupplierEntity | null;
	@ApiProperty({
		type: () => ProductRateEntity,
		isArray: true,
		required: false,
	})
	productRate?: ProductRateEntity[];
	@ApiProperty({
		type: () => AccountExternalEntity,
		required: false,
		nullable: true,
	})
	accountExternal?: AccountExternalEntity | null;
	@ApiProperty({
		type: () => AccountEntity,
		required: false,
		nullable: true,
	})
	account?: AccountEntity | null;
	@ApiProperty({
		type: () => BillEntity,
		isArray: true,
		required: false,
	})
	bill?: BillEntity[];
	@ApiProperty({
		type: () => CartEntity,
		isArray: true,
		required: false,
	})
	cart?: CartEntity[];
	@ApiProperty({
		type: () => DiscountEntity,
		isArray: true,
		required: false,
	})
	discount?: DiscountEntity[];
	@ApiProperty({
		type: () => BoxChatMemberEntity,
		isArray: true,
		required: false,
	})
	boxChatMember?: BoxChatMemberEntity[];
	@ApiProperty({
		type: () => MessageEntity,
		isArray: true,
		required: false,
	})
	message?: MessageEntity[];
}
