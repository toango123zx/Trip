import { Injectable } from '@nestjs/common';

import { BillStatusEnum } from '@prisma/client';
import { CreateTransactionDto, TransactionEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class TransactionRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createTransactionSuccess(
		transaction: CreateTransactionDto,
	): Promise<TransactionEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			await prisma.bill.update({
				where: {
					id: transaction.bill.connect.id,
					status: BillStatusEnum.pending,
				},
				data: {
					status: BillStatusEnum.paid,
					transaction: {
						deleteMany: {
							billId: transaction.bill.connect.id,
						},
					},
				},
			});
			const transsaction = await prisma.transaction.create({
				include: {
					bill: true,
				},
				data: {
					...transaction,
				},
			});

			return transsaction;
		});
	}
}
