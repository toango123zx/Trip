import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
} from 'src/common';

import { BillRepository } from '../../cart.repository';
import { GetBillByBillIdQuery } from '../implements';

@QueryHandler(GetBillByBillIdQuery)
export class GetBillByBillIdHandler implements IQueryHandler<GetBillByBillIdQuery> {
	constructor(private readonly billRepository: BillRepository) {}

	async execute(
		query: GetBillByBillIdQuery,
	): Promise<HttpResponseBodySuccessDto<any> | HttpException> {
		const { billId, myInformation } = query;
		const bill = await this.billRepository.getBillByBillId(billId);

		if (!bill) {
			throw new NotFoundException('billId');
		}

		if (bill.userId !== myInformation.id) {
			const condition = bill.infoBill.map((infoBill) => {
				return (
					infoBill.productSchedule.product.supplier.userId === myInformation.id
				);
			});
			if (!condition) {
				throw new ForbiddenException();
			}
		}

		return {
			success: true,
			data: bill,
		};
	}
}
