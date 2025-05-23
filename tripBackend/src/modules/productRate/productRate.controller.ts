import { Controller, Delete, HttpException, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PermissionEnum } from 'src/common';

import { AuthPermission } from '../auth/decorators';

import { DeleteProductRateByProductRateIdCommand } from './commands/implements';

@Controller('rate')
export class ProductRateController {
	constructor(private readonly commandBus: CommandBus) {}

	@Delete('/:productRateId')
	@AuthPermission(PermissionEnum.DeleteProductRateByProductRateId)
	async deleteProductRateByProductRateId(
		@Param('productRateId') productRateId: string,
	): Promise<
		| HttpResponseBodySuccessDto<DeleteProductRateByProductRateIdCommand>
		| HttpException
	> {
		return this.commandBus.execute(
			new DeleteProductRateByProductRateIdCommand(productRateId),
		);
	}
}
