import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	ObjectComparerDto,
} from 'src/common';
import { UpdateUserDto, UserEntity } from 'src/models';

import { RoleRepository } from 'src/modules/role/role.repository';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { UpdateUserInformationByUserIdCommand } from '../implements';

@CommandHandler(UpdateUserInformationByUserIdCommand)
export class UpdateUserInformationByUserIdHandler
	implements ICommandHandler<UpdateUserInformationByUserIdCommand>
{
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
	) {}

	async execute(
		command: UpdateUserInformationByUserIdCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const { userId, updateUserDataRequest } = command;

		const user = await this.userRepository.findUserByUserId(userId);
		if (!user) {
			throw new NotFoundException('userId');
		}

		const { roleName, ...updateData } = updateUserDataRequest;
		const updateUserData: UpdateUserDto = { ...updateData };
		if (roleName) {
			const role = await this.roleRepository.findRoleByName(roleName);
			updateUserData.role = {
				connect: {
					id: role.id,
				},
			};
			if (user.role.id == updateUserData.role.connect.id) {
				delete updateUserData.role;
			}
		}

		const userUpdatedFields = new ObjectComparerDto<UserEntity>(
			user,
		).getUpdatedFields<UpdateUserDto>(updateUserData);

		if (userUpdatedFields.email) {
			const userByEmail = await this.userRepository.findUserByEmail(
				userUpdatedFields.email,
			);
			if (userByEmail) {
				throw new ConflictException('email');
			}
		}

		const updatedUser = await this.userRepository.updateUserByUserId(
			userId,
			userUpdatedFields,
		);

		return {
			success: true,
			data: new UserInformationDto(updatedUser).getUserInformation(),
		};
	}
}
