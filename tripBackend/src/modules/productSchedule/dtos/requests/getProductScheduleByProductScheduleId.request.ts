import { ApiProperty } from '@nestjs/swagger';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetProductScheduleByProductScheduleIdRequestDto {
	@ApiProperty({
		type: 'string',
		enum: ProductScheduleStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(ProductScheduleStatusEnum)
	status: ProductScheduleStatusEnum;
}
