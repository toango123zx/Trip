import { ApiProperty } from '@nestjs/swagger';

import { DiscountProviderTypeEnum, DiscountStatusEnum } from '@prisma/client';

import { DiscountApplicationScopeEntity } from '../../discountApplicationScope/entities/discountApplicationScope.entity';
import { DiscountEligibilityEntity } from '../../discountEligibility/entities/discountEligibility.entity';
import { DiscountForBillEntity } from '../../discountForBill/entities/discountForBill.entity';
import { DiscountTypeEntity } from '../../discountType/entities/discountType.entity';
import { InfoBillDiscountEntity } from '../../infoBillDiscount/entities/infoBillDiscount.entity';
import { InfoDiscountEntity } from '../../infoDiscount/entities/infoDiscount.entity';
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
		enum: DiscountProviderTypeEnum,
		enumName: 'DiscountProviderTypeEnum',
	})
	discountProviderType: DiscountProviderTypeEnum;
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
		enum: DiscountStatusEnum,
		enumName: 'DiscountStatusEnum',
	})
	status: DiscountStatusEnum;
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
