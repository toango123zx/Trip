import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateBillUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateBillUserRelationInputDto)
export class CreateBillDto {
	@ApiProperty({
		type: CreateBillUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateBillUserRelationInputDto)
	user: CreateBillUserRelationInputDto;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	reductionPrice: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	totalPrice: number;
}
