import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInforamtion } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateSupplierCommand } from './commands/implements';
import { CreateSupplierRequestDto, SupplierInformationResponseDto } from './dtos';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Post()
	@Auth()
	async createSupplier(
		@Body() createSupplierRequestDto: CreateSupplierRequestDto,
		@MyInforamtion() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<SupplierInformationResponseDto | HttpException>> {
		return this.commandBus.execute(
			new CreateSupplierCommand(createSupplierRequestDto, userInformation),
		);
	}
}
