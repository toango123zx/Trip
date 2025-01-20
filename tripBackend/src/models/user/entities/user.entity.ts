import { userStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../role/entities/role.entity';
import { SupplierEntity } from '../../supplier/entities/supplier.entity';
import { ProductRateEntity } from '../../product_rate/entities/product_rate.entity';
import { AccountExternalEntity } from '../../account_external/entities/account_external.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { CartEntity } from '../../cart/entities/cart.entity';
import { DiscountEntity } from '../../discount/entities/discount.entity';
import { BoxChatMemberEntity } from '../../box_chat_member/entities/box_chat_member.entity';
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
	Role?: RoleEntity;
	@ApiProperty({
		type: 'string',
	})
	image: string;
	@ApiProperty({
		type: 'string',
	})
	gender: string;
	@ApiProperty({
		type: 'string',
	})
	email: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	dateOfBirth: Date;
	@ApiProperty({
		type: 'string',
	})
	phoneNumber: string;
	@ApiProperty({
		type: 'string',
	})
	address: string;
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
		enum: userStatusEnum,
	})
	status: userStatusEnum;
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
		isArray: true,
		required: false,
	})
	accountExternal?: AccountExternalEntity[];
	@ApiProperty({
		type: () => AccountEntity,
		isArray: true,
		required: false,
	})
	account?: AccountEntity[];
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
	Cacartrt?: CartEntity[];
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
