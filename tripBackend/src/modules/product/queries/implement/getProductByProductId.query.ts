import { IQuery } from '@nestjs/cqrs';

export class GetProductByProductIdQuery implements IQuery {
	constructor(public productId: string) {}
}
