import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
	IsArray,
	IsNumber,
	IsNotEmpty,
	IsString,
	IsPositive,
	ValidateNested,
} from 'class-validator';

class SchedulesInCreateBillRequest {
	@ApiProperty({
		type: 'string',
		required: true,
		default: 'cmaggraoh000ie558x0tt3t53',
	})
	@IsNotEmpty()
	@IsString()
	scheduleId: string;

	@ApiProperty({
		type: 'number',
		required: true,
		default: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	quantity: number;
}

export class CreateBillRequest {
	@ApiProperty({
		type: [SchedulesInCreateBillRequest],
		required: true,
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SchedulesInCreateBillRequest)
	schedules: SchedulesInCreateBillRequest[];

	@ApiProperty({
		type: [String],
		required: true,
		default: ['cmap3mzyw0000e5kc0rlc1ku6'],
	})
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	discountIds: string[];
}
