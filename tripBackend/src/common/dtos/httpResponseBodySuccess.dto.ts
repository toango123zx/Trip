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

export class HttpResponseBodySuccessDto<T> {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Object,
	})
	data: T;
	@ApiProperty({
		required: false,
		nullable: true,
		type: Object,
	})
	pagination?: PaginationDto;
	@ApiProperty({
		required: true,
		nullable: false,
		type: String,
	})
	status: string = 'success';
}
