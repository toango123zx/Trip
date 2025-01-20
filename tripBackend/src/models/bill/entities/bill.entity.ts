import { billStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentMethodEntity } from '../../payment_method/entities/payment_method.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { InfoBillEntity } from '../../info_bill/entities/info_bill.entity';
import { InfoBillDiscountEntity } from '../../info_bill_discount/entities/info_bill_discount.entity';
import { DiscountForBillEntity } from '../../discount_for_bill/entities/discount_for_bill.entity';

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
		enum: billStatusEnum,
	})
	status: billStatusEnum;
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
