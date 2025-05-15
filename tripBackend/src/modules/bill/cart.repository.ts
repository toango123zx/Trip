import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/services';

@Injectable()
export class BillRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getBillByBillId(billId: string) {
		return this.prismaService.bill.findFirst({
			include: {
				infoBill: {
					include: {
						productSchedule: {
							include: {
								product: {
									include: {
										supplier: {
											include: {
												user: true,
											},
										},
										productCategory: true,
										location: true,
									},
								},
							},
						},
					},
				},
				infoBillDiscount: {
					include: {
						discount: {
							include: {
								infoDiscount: {
									include: {
										productSchedule: true,
									},
								},
							},
						},
					},
				},
				discountForBill: {
					include: {
						discount: true,
					},
				},
				paymentMethod: true,
				transaction: true,
				user: true,
			},
			where: {
				id: billId,
			},
		});
	}
}
