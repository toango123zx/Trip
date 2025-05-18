import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	DiscountStatusEnum,
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
	TransactionTargetEnum,
} from '@prisma/client';
import {
	ConflictException,
	DiscountApplicationScopeEnum,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { CreateBillDto, DiscountEntity, ProductScheduleEntity } from 'src/models';

import { DiscountRepository } from 'src/modules/discount/discount.repository';
import { PaymentMethodRepository } from 'src/modules/paymentMethod/paymentMethod.repository';
import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { BillRepository } from '../../bill.repository';
import { BillDetailResponseDto } from '../../dtos';
import { CreateBillCommand } from '../implements';

class BillInfo {
	quantity: number;
	scheduleId: string;
	totalPrice: number;
	reduction: number;
	paymentPrice: number;
}
class Bill {
	totalPrice: number;
	reductionPrice: number;
	infoBill: BillInfo[];
}

@CommandHandler(CreateBillCommand)
export class CreateBillHandler implements ICommandHandler<CreateBillCommand> {
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly discountRepository: DiscountRepository,
		private readonly paymentMethodRepository: PaymentMethodRepository,
		private readonly billRepository: BillRepository,
	) {}

	/**
	 * Ensures that:
	 * 1. No two schedules overlap in time.
	 * 2. The requested quantity for each schedule does not exceed
	 *    (quantityAvailable - booked) for that product.
	 *

	* @returns `true` if all schedules are non-overlapping and all requested quantities
	*          are within available stock; `false` otherwise (as soon as a violation is found).
	*/
	areProductSchedulesValid(
		schedules: { schedule: ProductScheduleEntity; quantity: number }[],
	): boolean {
		if (schedules.length < 2) {
			// If there are fewer than 2 entries, no overlap is possible,
			// still need to check quantity though
			return schedules.every(({ schedule, quantity }) => {
				const available = schedule.product.quantityAvailable - schedule.booked;
				return quantity <= available;
			});
		}

		// 1. Check quantity constraints first
		for (const { schedule, quantity } of schedules) {
			const available = schedule.product.quantityAvailable - schedule.booked;
			if (quantity > available) {
				return false;
			}
		}

		// 2. Check for time overlaps
		const sorted = schedules
			.slice()
			.sort(
				(a, b) => a.schedule.startTime.getTime() - b.schedule.startTime.getTime(),
			);

		const hasOverlap = sorted.some((curr, i, arr) => {
			if (i === 0) return false;
			const prev = arr[i - 1].schedule;
			return curr.schedule.startTime < prev.endTime;
		});

		return !hasOverlap;
	}

	/**
	 * Validates an array of Discount objects against two rules:
	 * 1. Exactly one discount must have scope 'bill'.
	 * 2. If there is more than one Discount in the array, none of them may have stackable === 0.
	 * 3. No two entries share the same combination of (productScheduleId, scope, provider_type).
	 *
	 * @returns true if every (productScheduleId, scope, provider_type) combination is unique;
	 *          false if any duplicate combination is detected.
	 */
	validateDiscounts(discounts: DiscountEntity[]): boolean {
		let billCount = 0;
		const multiple = discounts.length > 1;

		const seen = new Set<string>();
		for (const { discountApplicationScope, stackable, infoDiscount } of discounts) {
			// Rule #1
			if (discountApplicationScope.name === DiscountApplicationScopeEnum.Bill) {
				if (++billCount > 1) return false;
			}

			// Rule #2:
			if (multiple && !stackable) {
				return false;
			}

			// Rule #3:
			for (const { productScheduleId } of infoDiscount) {
				const key = `${productScheduleId}|${discountApplicationScope.id}`;
				if (seen.has(key)) {
					return false;
				}
				seen.add(key);
			}

			return true;
		}
	}

	/**
	 * Ensures that for each Discount with `discountEligibility === 'together'`,
	 * every `productScheduleId` in its `infoDiscount` array exists in the provided schedules.
	 *
	 * @returns `true` if all “together” discounts only reference existing schedule IDs;
	 *          `false` immediately when a missing ID is found.
	 */
	validateTogetherDiscounts(
		schedules: ProductScheduleEntity[],
		discounts: DiscountEntity[],
	): boolean {
		const validIds = new Set(schedules.map((s) => s.id));

		for (const { discountEligibility, infoDiscount } of discounts) {
			if (discountEligibility.name === 'together') {
				for (const { productScheduleId } of infoDiscount) {
					if (!validIds.has(productScheduleId)) {
						return false;
					}
				}
			}
		}

		return true;
	}

	/**
	 * Checks that for each Discount with `discountEligibility.name === 'together'`,
	 * every `productScheduleId` referenced in its `infoDiscount` array exists
	 * among the provided schedules.
	 *
	 * @returns `true` if all “together” discounts reference only existing schedule IDs;
	 *          `false` as soon as a missing ID is encountered.
	 */
	calculateBill(
		schedules: { schedule: ProductScheduleEntity; quantity: number }[],
		discounts: DiscountEntity[],
	): Bill {
		// 1. Split discounts into bill-level vs per-schedule
		const billDiscounts: DiscountEntity[] = [];
		const schedDiscMap: Record<string, DiscountEntity[]> = {};

		for (const d of discounts) {
			if (d.discountApplicationScope.name === DiscountApplicationScopeEnum.Bill) {
				billDiscounts.push(d);
			} else {
				for (const { id } of d.infoDiscount) {
					if (!schedDiscMap[id]) schedDiscMap[id] = [];
					schedDiscMap[id]!.push(d);
				}
			}
		}

		// 2. Helper to compute total discount from a list of DiscountEntity
		//    - baseAmount: used for percentage calculations
		//    - qty: used when FixedAmount discounts apply per unit
		function applyDiscounts(
			ds: DiscountEntity[],
			baseAmount: number,
			qty: number = 1,
		): number {
			let stackableSum = 0;
			let nonStackableMax = 0;

			for (const d of ds) {
				const amt =
					d.discountType.name === 'Percentage'
						? baseAmount * (d.value / 100)
						: d.value * qty;

				if (d.stackable) {
					stackableSum += amt;
				} else {
					nonStackableMax = Math.max(nonStackableMax, amt);
				}
			}

			return stackableSum + nonStackableMax;
		}

		// 3. Build per-line info, summing up totals and schedule-level reductions
		const infoBill: BillInfo[] = [];
		let totalPrice = 0;
		let totalScheduleReduction = 0;

		for (const { schedule, quantity } of schedules) {
			const { id, price: unitPrice } = schedule;
			const totalPriceItem = unitPrice * quantity;
			const schedDs = schedDiscMap[id] || [];
			const reduction = applyDiscounts(schedDs, totalPriceItem, quantity);

			infoBill.push({
				scheduleId: id,
				quantity,
				totalPrice: totalPriceItem,
				reduction,
				paymentPrice: totalPriceItem - reduction,
			});

			totalPrice += totalPriceItem;
			totalScheduleReduction += reduction;
		}

		// 4. Compute bill-level discounts based on the grand total
		const totalBillReduction = applyDiscounts(billDiscounts, totalPrice);

		// 5. Return the final bill
		return {
			totalPrice,
			reductionPrice: totalScheduleReduction + totalBillReduction,
			infoBill,
		};
	}

	async execute(
		command: CreateBillCommand,
	): Promise<HttpResponseBodySuccessDto<BillDetailResponseDto> | HttpException> {
		const { myInformation, billInformation } = command;
		const { schedules, discountIds, paymentMethodId } = billInformation;

		const paymentMedthod =
			await this.paymentMethodRepository.getPaymentMethodByPaymentMethodId(
				paymentMethodId,
			);
		if (!paymentMedthod) {
			throw new NotFoundException('paymentMethod');
		}

		if (new Set(discountIds).size !== discountIds.length) {
			throw new OptionalException(HttpStatus.CONFLICT, 'Discount not available');
		}

		const scheduleIds = schedules.map((schedule) => schedule.scheduleId);
		const [productSchedulesInformation, totalProductSchedulesInformation] =
			await this.productScheduleRepository.findProductSchedulesByProductSchedulesId(
				scheduleIds,
				ProductScheduleStatusEnum.active,
				true,
			);
		if (schedules.length !== totalProductSchedulesInformation) {
			throw new NotFoundException('productScheduleId');
		}

		if (
			!this.areProductSchedulesValid(
				productSchedulesInformation.map((schedule) => ({
					schedule,
					quantity: schedules.find((s) => s.scheduleId === schedule.id)
						.quantity,
				})),
			)
		) {
			throw new ConflictException('productScheduleId');
		}

		const [discountsInformation, totalDiscountsInformation] =
			await this.discountRepository.findDiscountsByDiscountIds(
				discountIds,
				undefined,
				scheduleIds,
				DiscountStatusEnum.active,
				InfoDiscountStatusEnum.active,
				true,
			);

		if (discountIds.length !== totalDiscountsInformation) {
			throw new NotFoundException('discountId');
		}
		if (!this.validateDiscounts(discountsInformation)) {
			throw new ConflictException('discountId');
		}

		if (
			!this.validateTogetherDiscounts(
				productSchedulesInformation,
				discountsInformation,
			)
		) {
			throw new ConflictException('productScheduleId');
		}

		const { totalPrice, reductionPrice, infoBill } = this.calculateBill(
			productSchedulesInformation.map((schedule) => ({
				schedule,
				quantity: schedules.find((s) => s.scheduleId === schedule.id).quantity,
			})),
			discountsInformation,
		);

		const bill: CreateBillDto = {
			user: {
				connect: {
					id: myInformation.id,
				},
			},
			totalPrice: totalPrice,
			reductionPrice: reductionPrice,
			paymentMethod: {
				connect: {
					id: paymentMethodId,
				},
			},
			transaction: {
				create: {
					code: new Date().getTime().toString(),
					transactionTarget: TransactionTargetEnum.pay,
					description: 'Pay bills',
				},
			},
			infoBill: {
				create: infoBill.map((info) => ({
					productSchedule: {
						connect: {
							id: info.scheduleId,
						},
					},
					quantity: info.quantity,
				})),
			},
		};
		const discountForSchedule: string[] = [];
		let discountForBill: string;
		for (const discount of discountsInformation) {
			if (
				discount.discountApplicationScope.name ===
				DiscountApplicationScopeEnum.Schedule
			) {
				discountForSchedule.push(discount.id);
				continue;
			}
			if (
				discount.discountApplicationScope.name ===
				DiscountApplicationScopeEnum.Bill
			) {
				discountForBill = discount.id;
			}
		}

		const billCreated = await this.billRepository.createBill1(
			bill,
			scheduleIds,
			discountForSchedule,
			discountForBill,
		);
		return {
			success: true,
			data: new BillDetailResponseDto(billCreated),
		};
	}
}
