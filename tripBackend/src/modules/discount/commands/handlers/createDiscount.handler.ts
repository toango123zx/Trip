import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DiscountProviderTypeEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { CreateDiscountDto } from 'src/models';

import { DiscountEligibilityRepository } from 'src/modules/discountEligibility/discountEligibility.repository';
import { DiscountTypeRepository } from 'src/modules/discountType/discountType.repository';
import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountByDiscountIdResponseDto } from '../../dtos';
import { CreateDiscountCommand } from '../implements';

import { DiscountApplicationScopeRepository } from './../../../discountApplicationScope/discountApplicationScope.repository';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountHandler implements ICommandHandler<CreateDiscountCommand> {
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly discountRepository: DiscountRepository,
		private readonly discountTypeRepository: DiscountTypeRepository,
		private readonly discountEligibilityRepository: DiscountEligibilityRepository,
		private readonly discountApplicationScopeRepository: DiscountApplicationScopeRepository,
	) {}

	async execute(
		command: CreateDiscountCommand,
	): Promise<
		HttpResponseBodySuccessDto<GetDiscountByDiscountIdResponseDto> | HttpException
	> {
		const { discountInformation, myInformation } = command;
		const discountType =
			await this.discountTypeRepository.findDiscountTypeByDiscountTypeId(
				discountInformation.discountTypeId,
			);
		if (!discountType) {
			throw new NotFoundException('discount type');
		}

		const discountEligibility =
			await this.discountEligibilityRepository.findDiscountEligibilityByDiscountEligibilityId(
				discountInformation.discountEligibilityId,
			);
		if (!discountEligibility) {
			throw new NotFoundException('discount eligibility');
		}

		const discountApplicationScope =
			await this.discountApplicationScopeRepository.findDiscountApplicationScopeByDiscountApplicationScopeId(
				discountInformation.discountApplicationScopeId,
			);
		if (!discountApplicationScope) {
			throw new NotFoundException('discount application scope');
		}

		const schedules =
			discountInformation.scheduleIds &&
			discountInformation.scheduleIds.length !== 0
				? await Promise.all(
						discountInformation.scheduleIds?.map(async (scheduleId) => {
							return await this.productScheduleRepository.findProductScheduleByProductScheduleId(
								String(scheduleId),
							);
						}),
					)
				: undefined;
		if (
			discountInformation.scheduleIds &&
			schedules.length !== discountInformation.scheduleIds.length
		) {
			throw new NotFoundException('schedule Id');
		}

		const discount: CreateDiscountDto = {
			name: discountInformation.name,
			description: discountInformation.description,
			discountProviderType: myInformation.roleName.includes('admin')
				? DiscountProviderTypeEnum.admin
				: DiscountProviderTypeEnum.supplier,
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
			point: discountInformation.point || 0,
			stackable: discountInformation.stackable || false,
			user: {
				connect: {
					id: myInformation.id,
				},
			},
		};
		const createdDiscount = await this.discountRepository.createDiscount(
			discount,
			discountInformation.scheduleIds,
		);

		return {
			success: true,
			data: new GetDiscountByDiscountIdResponseDto(createdDiscount),
		};
	}
}
