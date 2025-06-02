import { ICommand } from '@nestjs/cqrs';

export class UpdatePaidBillCommand implements ICommand {
	constructor(public readonly billId: string) {}
}
