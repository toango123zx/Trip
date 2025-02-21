import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	RoleEnum,
} from 'src/common';

import { RoleRepository } from 'src/modules/role/role.repository';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { UpdateAdminRoleForUserCommand } from '../implements';

@CommandHandler(UpdateAdminRoleForUserCommand)
export class UpdateAdminRoleForUserHandler
	implements ICommandHandler<UpdateAdminRoleForUserCommand>
{
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
	) {}

	async execute(
		command: UpdateAdminRoleForUserCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const userId = command.userId;
		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new NotFoundException('userId');
		}

		if (user.role.name === RoleEnum.Admin) {
			throw new ConflictException('user is already an admin');
		}

		const roleAdmin = await this.roleRepository.findRoleByName(RoleEnum.Admin);

		const newUser: UserInformationDto = await this.userRepository.updateAdminUserRole(
			userId,
			roleAdmin.id,
		);

		newUser.roleName = newUser.role.name;
		delete newUser.role;
		delete newUser.roleId;
		return { success: true, data: newUser };
	}
}
