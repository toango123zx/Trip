import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UpdateMyInformationRequestDto } from 'src/modules/user/dtos';

export class CreateSupplierRequestDto extends UpdateMyInformationRequestDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	@Length(13, 13)
	taxId: string;
}
