import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	ObjectComparerDto,
	OptionalException,
	RoleEnum,
} from 'src/common';
import { UserEntity } from 'src/models';
import { UpdateMyInformationRequestDto } from 'src/modules/user/dtos';

import { RoleRepository } from 'src/modules/role/role.repository';

import { SupplierInformationResponseDto } from '../../dtos';
import { SupplierRepository } from '../../supplier.repository';
import { CreateSupplierCommand } from '../implements';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler implements ICommandHandler<CreateSupplierCommand> {
	constructor(
		private readonly supplierRepository: SupplierRepository,
		private readonly roleRepository: RoleRepository,
	) {}

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
			roleName,
			supplier: supplierInformation,
			...userData
		} = {
			...userInformation,
			...updateUser,
		};
		if (roleName != RoleEnum.Tourist) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'Only tourist can create supplier',
			);
		}

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

		const roleSupplier = await this.roleRepository.findRoleByName(RoleEnum.Supplier);

		const supplier = await this.supplierRepository.createSupplierByUserId(
			userInformation.id,
			updateUserData,
			roleSupplier.id,
			taxId,
		);

		return {
			success: true,
			data: new SupplierInformationResponseDto(supplier).getSupplierInformation(),
		};
	}
}
