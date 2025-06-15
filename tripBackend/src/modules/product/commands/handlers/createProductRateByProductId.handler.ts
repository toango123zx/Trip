import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BillStatusEnum, ProductScheduleStatusEnum } from '@prisma/client';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { CreateProductRateDto } from 'src/models';
import { GetProductRatesResponseDto } from 'src/modules/productRate/dto';

import { BillRepository } from 'src/modules/bill/bill.repository';
import { ProductRateRepository } from 'src/modules/productRate/productRate.repository';

import { ProductRepository } from '../../product.repository';
import { CreateProductRateByProductIdCommand } from '../implements';

@CommandHandler(CreateProductRateByProductIdCommand)
export class CreateProductRateByProductIdHandler
	implements ICommandHandler<CreateProductRateByProductIdCommand> {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly billRepository: BillRepository,
		private readonly productRateRepository: ProductRateRepository,
	) { }

	async execute(
		command: CreateProductRateByProductIdCommand,
	): Promise<HttpResponseBodySuccessDto<GetProductRatesResponseDto> | HttpException> {
		const { productId, productRateInformation, myInformation } = command;

		const product = await this.productRepository.findProductByProductId(productId);
		if (!product) {
			throw new NotFoundException('productId');
		}

		// const existProductRate = product.productSchedule.filter((schedule) => {
		// 	return schedule.infoBill.filter((infoBill) => {
		// 		return infoBill.bill.status === BillStatusEnum.done && infoBill.billId === productRateInformation.billId && infoBill.bill.userId === myInformation.id;
		// 	});
		// }).flat();

		// if (existProductRate) {
		// 	throw new OptionalException(
		// 		HttpStatus.CONFLICT,
		// 		'You have rated this product.',
		// 	);
		// }

		const bill = await this.billRepository.findBillByBillId(
			productRateInformation.billId
		);

		if (!bill) {
			throw new NotFoundException('billId');
		}

		if (bill.userId !== myInformation.id) {
			throw new ForbiddenException()
		}

		if (bill.status !== BillStatusEnum.done) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'Must complete product for rate.',
			);
		}

		const infoBillExistProductRate = bill.infoBill.find((infoBill) => {
			return infoBill.productSchedule.productId === productId && infoBill.productSchedule.status === ProductScheduleStatusEnum.completed;
		});

		if (!infoBillExistProductRate) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'Must complete product for rate.',
			);
		}
		// const totalRecordsProductRate =
		// 	await this.productRateRepository.findProductRatesByProductId(
		// 		productId,
		// 		myInformation.id,
		// 	)[1];

		// const [bills, totalRecordsBill] = await this.billRepository.findBillsByUserId(
		// 	undefined,
		// 	myInformation.id,
		// 	product.supplier.userId,
		// 	product.id,
		// 	undefined,
		// 	undefined,
		// 	ProductScheduleStatusEnum.completed,
		// );
		// const verify = bills.filter(
		// 	(bill) =>
		// 		bill.status === BillStatusEnum.done ||
		// 		bill.status === BillStatusEnum.paid,
		// );

		// if (totalRecordsBill === 0 && verify.length === 0) {
		// 	throw new OptionalException(
		// 		HttpStatus.FORBIDDEN,
		// 		'Must complete product for rate.',
		// 	);
		// }

		// if (totalRecordsProductRate === verify.length) {
		// 	throw new OptionalException(
		// 		HttpStatus.CONFLICT,
		// 		'You have rated this product.',
		// 	);
		// }

		product.avgRate =
			(product.avgRate * product.quantityRate + productRateInformation.star) /
			(product.quantityRate + 1);

		const productRate: CreateProductRateDto = {
			product: {
				connect: {
					id: productId,
				},
			},
			user: {
				connect: {
					id: myInformation.id,
				},
			},
			star: productRateInformation.star,
			comment: productRateInformation.comment,
			infoBill: {
				connect: {
					id: infoBillExistProductRate.id,
				},
			}
		};
		const productRateCreated = await this.productRateRepository.createProductRate(
			productRate,
			product.avgRate,
		);

		return {
			success: true,
			data: new GetProductRatesResponseDto(productRateCreated),
			pagination: undefined,
		};
	}
}
