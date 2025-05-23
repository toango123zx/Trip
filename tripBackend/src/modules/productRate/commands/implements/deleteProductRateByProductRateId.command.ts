import { ICommand } from '@nestjs/cqrs';

export class DeleteProductRateByProductRateIdCommand implements ICommand {
	constructor(public readonly productRateId: string) {}
}
