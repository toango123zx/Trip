import { Injectable } from '@nestjs/common';

import { BillStatusEnum } from '@prisma/client';
import { CreateTransactionSessionDto, TransactionSessionEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class TransactionSessionRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findTransactionSession(
		transactionReferenceId: string,
		billStatus?: BillStatusEnum,
	): Promise<TransactionSessionEntity> {
		return this.prismaService.transactionSession.findFirst({
			include: {
				bill: true,
				paymentMethod: true,
			},
			where: {
				id: transactionReferenceId,
				bill: {
					status: billStatus,
				},
			},
		});
	}

	async createTransactionSession(
		transactionSession: CreateTransactionSessionDto,
	): Promise<TransactionSessionEntity> {
		return this.prismaService.transactionSession.create({
			data: transactionSession,
		});
	}

	async deleteTranasactionSession(
		transactionSessionId: string,
	): Promise<TransactionSessionEntity> {
		return this.prismaService.transactionSession.delete({
			where: {
				id: transactionSessionId,
			},
		});
	}
}
