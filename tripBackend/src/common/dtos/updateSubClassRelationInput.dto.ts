import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubClassRelationInputDto<T> {
	@ApiProperty({
		required: false,
		nullable: true,
		type: Object,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => Object)
	update?: T;
}

// export class UpdateLecturerOnUpdateUserDto extends UpdateUserDto {
// 	constructor() {
// 		super();
// 	}

// 	@ApiProperty({
// 		required: false,
// 		nullable: true,
// 		type: UpdateSubClassRelationInputDto<UpdateClassLecturerRelationInputDto>,
// 	})
// 	@IsOptional()
// 	@ValidateNested()
// 	@Type(() => UpdateSubClassRelationInputDto<UpdateClassLecturerRelationInputDto>)
// 	Lecturer?: UpdateSubClassRelationInputDto<UpdateClassLecturerRelationInputDto>;
// }
