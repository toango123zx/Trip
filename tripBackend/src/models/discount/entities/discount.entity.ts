import { ApiProperty } from '@nestjs/swagger';

import { discountProviderTypeEnum, discountStatus } from '@prisma/client';

import { DiscountApplicationScopeEntity } from '../../discount_application_scope/entities/discount_application_scope.entity';
import { DiscountEligibilityEntity } from '../../discount_eligibility/entities/discount_eligibility.entity';
import { DiscountForBillEntity } from '../../discount_for_bill/entities/discount_for_bill.entity';
import { DiscountTypeEntity } from '../../discount_type/entities/discount_type.entity';
import { InfoBillDiscountEntity } from '../../info_bill_discount/entities/info_bill_discount.entity';
import { InfoDiscountEntity } from '../../info_discount/entities/info_discount.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class DiscountEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		enum: discountProviderTypeEnum,
	})
	discountProviderType: discountProviderTypeEnum;
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
	code: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	endTime: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	value: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantity: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	point: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	applited: number;
	@ApiProperty({
		type: 'boolean',
	})
	stackable: boolean;
	@ApiProperty({
		type: 'string',
	})
	discountTypeId: string;
	@ApiProperty({
		type: () => DiscountTypeEntity,
		required: false,
	})
	discountType?: DiscountTypeEntity;
	@ApiProperty({
		type: 'string',
	})
	discountEligibilityId: string;
	@ApiProperty({
		type: () => DiscountEligibilityEntity,
		required: false,
	})
	discountEligibility?: DiscountEligibilityEntity;
	@ApiProperty({
		type: 'string',
	})
	discountApplicationScopeId: string;
	@ApiProperty({
		type: () => DiscountApplicationScopeEntity,
		required: false,
	})
	discountApplicationScope?: DiscountApplicationScopeEntity;
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
		enum: discountStatus,
	})
	status: discountStatus;
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
	@ApiProperty({
		type: () => InfoDiscountEntity,
		isArray: true,
		required: false,
	})
	infoDiscount?: InfoDiscountEntity[];
}
