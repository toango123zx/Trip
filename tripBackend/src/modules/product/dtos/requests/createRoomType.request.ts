import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, IsString, IsOptional, IsArray } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';

// class AmenityRequestDto {
//     @ApiProperty({
//         type: String,
//         required: true,
//     })
//     @IsNotEmpty()
//     @IsString()
//     @AutoTrim()
//     id: string;
// }

class BedTypeRequestDto {
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	id: string;
	@ApiProperty({
		type: Number,
		required: true,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	quantity: number;
}

export class CreateRoomTypeRequestDto {
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	name: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	description: string;
	@ApiProperty({
		type: Number,
		required: true,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	maxOccupancy: number;
	@ApiProperty({
		type: Number,
		required: true,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	quantity: number;
	@ApiProperty({
		type: Number,
		required: true,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	price: number;
	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
		default: [],
	})
	@IsOptional()
	@IsArray()
	@Type(() => String)
	@IsString({ each: true })
	@AutoTrim()
	amenityIds: string[] = [];
	@ApiProperty({
		type: [BedTypeRequestDto],
		required: true,
	})
	@IsNotEmpty()
	@IsArray()
	@Type(() => BedTypeRequestDto)
	@AutoTrim()
	bedTypes: BedTypeRequestDto[];
}
