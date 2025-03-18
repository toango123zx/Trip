import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	ObjectComparerDto,
} from 'src/common';
import { UserEntity } from 'src/models';
import { UpdateMyInformationRequestDto } from 'src/modules/user/dtos';

import { SupplierInformationResponseDto } from '../../dtos';
import { SupplierRepository } from '../../supplier.repository';
import { CreateSupplierCommand } from '../implements';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler implements ICommandHandler<CreateSupplierCommand> {
	constructor(private readonly supplierRepository: SupplierRepository) {}

	async execute(
		command: CreateSupplierCommand,
	): Promise<
		HttpResponseBodySuccessDto<SupplierInformationResponseDto> | HttpException
	> {
		const { createSupplierRequestDto, userInformation } = command;

		const { taxId, ...updateUser } = createSupplierRequestDto;
		const isSupplierExist = await this.supplierRepository.findSupplierByUserId(
			userInformation.id,
		);
		const {
			deletedAt,
			permission,
			supplier: supplierInformation,
			...userData
		} = {
			...userInformation,
			...updateUser,
		};
		if (isSupplierExist) {
			throw new ConflictException('Supplier');
		}

		const isFullInformation = Object.values(userData).some(
			(value) => value === null || value === undefined,
		);
		if (isFullInformation) {
			throw new ConflictException('Incomplete user information');
		}

		const updateUserData = new ObjectComparerDto<UserEntity>(
			userInformation,
		).getUpdatedFields<UpdateMyInformationRequestDto>(updateUser);

		const supplier = await this.supplierRepository.createSupplierByUserId(
			userInformation.id,
			updateUserData,
			taxId,
		);

		return {
			success: true,
			data: new SupplierInformationResponseDto(supplier).getSupplierInformation(),
		};
	}
}
