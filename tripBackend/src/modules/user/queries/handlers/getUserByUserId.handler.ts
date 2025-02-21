import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { UserEntity } from 'src/models';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { GetUserByUserIdQuery } from '../implements';

@QueryHandler(GetUserByUserIdQuery)
export class GetUserByUserIdHandler implements IQueryHandler<GetUserByUserIdQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUserByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<UserEntity>> {
		const user: UserInformationDto = await this.userRepository.findUserById(
			query.userId,
		);
		if (!user) {
			throw new NotFoundException('userId');
		}

		user.roleName = user.role.name;
		delete user.role;
		delete user.roleId;

		return {
			success: true,
			data: user,
		};
	}
}
