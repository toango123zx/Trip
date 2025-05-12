import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { CreateDiscountDto, DiscountEntity } from 'src/models';

import { DiscountEligibilityRepository } from 'src/modules/discountEligibility/discountEligibility.repository';
import { DiscountTypeRepository } from 'src/modules/discountType/discountType.repository';

import { DiscountRepository } from '../../discount.repository';
import { CreateDiscountCommand } from '../implements';

import { DiscountApplicationScopeRepository } from './../../../discountApplicationScope/discountApplicationScope.repository';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountHandler implements ICommandHandler<CreateDiscountCommand> {
	constructor(
		private readonly discountRepository: DiscountRepository,
		private readonly discountTypeRepository: DiscountTypeRepository,
		private readonly discountEligibilityRepository: DiscountEligibilityRepository,
		private readonly discountApplicationScopeRepository: DiscountApplicationScopeRepository,
	) {}

	async execute(
		command: CreateDiscountCommand,
	): Promise<HttpResponseBodySuccessDto<DiscountEntity> | HttpException> {
		const { discountInformation, myInformation } = command;
		const discountType =
			await this.discountTypeRepository.findDiscountTypeByDiscountTypeId(
				discountInformation.discountTypeId,
			);
		if (!discountType) {
			throw new NotFoundException('discount type not found');
		}

		const discountEligibility =
			await this.discountEligibilityRepository.findDiscountEligibilityByDiscountEligibilityId(
				discountInformation.discountEligibilityId,
			);
		if (!discountEligibility) {
			throw new NotFoundException('discount eligibility not found');
		}

		const discountApplicationScope =
			await this.discountApplicationScopeRepository.findDiscountApplicationScopeByDiscountApplicationScopeId(
				discountInformation.discountApplicationScopeId,
			);
		if (!discountApplicationScope) {
			throw new NotFoundException('discount application scope not found');
		}

		const discount: CreateDiscountDto = {
			name: discountInformation.name,
			description: discountInformation.description,
			discountProviderType: 'admin',
			discountType: {
				connect: {
					id: discountType.id,
				},
			},
			discountEligibility: {
				connect: {
					id: discountEligibility.id,
				},
			},
			discountApplicationScope: {
				connect: {
					id: discountApplicationScope.id,
				},
			},
			startTime: discountInformation.startTime,
			endTime: discountInformation.endTime,
			quantity: discountInformation.quantity,
			value: discountInformation.value,
			point: discountInformation.point,
			user: {
				connect: {
					id: myInformation.id,
				},
			},
		};

		const createdDiscount = await this.discountRepository.createDiscount(discount);

		return {
			success: true,
			data: createdDiscount,
		};
	}
}
