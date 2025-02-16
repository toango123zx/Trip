import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { UserEntity } from 'src/models';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { GetUserQuery } from '../implements';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUserQuery,
	): Promise<HttpResponseBodySuccessDto<UserEntity>> {
		const user: UserInformationDto = await this.userRepository.findUserById(
			query.userId,
		);
		if (!user) {
			throw new NotFoundException('userId');
		}

		user.permission = user.role.infoPermission.map(
			(infoPermission) => infoPermission.permission,
		);
		delete user.role.infoPermission;
		return {
			success: true,
			data: user,
		};
	}
}
