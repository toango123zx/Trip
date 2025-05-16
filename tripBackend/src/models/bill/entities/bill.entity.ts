import { BillStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentMethodEntity } from '../../paymentMethod/entities/paymentMethod.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { InfoBillEntity } from '../../infoBill/entities/infoBill.entity';
import { InfoBillDiscountEntity } from '../../infoBillDiscount/entities/infoBillDiscount.entity';
import { DiscountForBillEntity } from '../../discountForBill/entities/discountForBill.entity';

export class BillEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	userId: string;
	@ApiProperty({
		type: () => UserEntity,
		required: false,
	})
	user?: UserEntity;
	@ApiProperty({
		type: 'string',
	})
	paymentMethodId: string;
	@ApiProperty({
		type: () => PaymentMethodEntity,
		required: false,
	})
	paymentMethod?: PaymentMethodEntity;
	@ApiProperty({
		type: 'string',
	})
	transactionTargetId: string;
	@ApiProperty({
		type: () => TransactionEntity,
		required: false,
	})
	transaction?: TransactionEntity;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	reductionPrice: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	totalPrice: number;
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
		enum: BillStatusEnum,
		enumName: 'BillStatusEnum',
	})
	status: BillStatusEnum;
	@ApiProperty({
		type: () => InfoBillEntity,
		isArray: true,
		required: false,
	})
	infoBill?: InfoBillEntity[];
	@ApiProperty({
		type: () => InfoBillDiscountEntity,
		isArray: true,
		required: false,
	})
	infoBillDiscount?: InfoBillDiscountEntity[];
	@ApiProperty({
		type: () => DiscountForBillEntity,
		isArray: true,
		required: false,
	})
	discountForBill?: DiscountForBillEntity[];
}
