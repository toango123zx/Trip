import { InfoDiscountStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class InfoDiscountDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
		enum: InfoDiscountStatusEnum,
		enumName: 'InfoDiscountStatusEnum',
	})
	status: InfoDiscountStatusEnum;
}
