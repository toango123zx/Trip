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
					transactionSession: {
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
					bill: {
						connect: {
							id: transaction.bill.connect.id,
						},
					},
					paymentMethod: {
						connect: {
							id: transaction.paymentMethod.connect.id,
						},
					},
					bankCode: transaction.bankCode,
					cardType: transaction.cardType,
					description: transaction.description,
					BankTransactionCode: transaction.BankTransactionCode,
					amount: transaction.amount,
					transactionCode: transaction.transactionCode,
					transactionTarget: transaction.transactionTarget,
					createAt: transaction.createAt,
					status: transaction.status,
					transactionSessionCode: transaction.transactionSessionCode,
				},
			});

			return transsaction;
		});
	}
}
