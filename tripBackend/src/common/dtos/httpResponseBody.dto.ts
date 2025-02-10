import { ApiProperty } from '@nestjs/swagger';

class PaginationDto {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Number,
	})
	totalItems: number;
	@ApiProperty({
		required: true,
		nullable: false,
		type: Number,
	})
	itemsPerPage: number;
	@ApiProperty({
		required: true,
		nullable: false,
		type: Number,
	})
	currentPage: number;
	@ApiProperty({
		required: true,
		nullable: false,
		type: Number,
	})
	totalPages: number;
}

export class HttpResponseBodyDto<T> {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Boolean,
	})
	success: boolean;
	@ApiProperty({
		required: false,
		nullable: true,
		type: Object,
	})
	data?: T;
	@ApiProperty({
		required: false,
		nullable: true,
		type: String,
	})
	message?: string;
	@ApiProperty({
		required: false,
		nullable: true,
		type: String,
	})
	error?: string;
	@ApiProperty({
		required: false,
		nullable: true,
		type: Object,
	})
	pagination?: PaginationDto;
}
