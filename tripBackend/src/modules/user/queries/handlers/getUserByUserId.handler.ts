import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { GetUserByUserIdQuery } from '../implements';

@QueryHandler(GetUserByUserIdQuery)
export class GetUserByUserIdHandler implements IQueryHandler<GetUserByUserIdQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUserByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto>> {
		const user = await this.userRepository.findUserById(query.userId);

		if (!user) {
			throw new NotFoundException('userId');
		}

		return {
			success: true,
			data: new UserInformationDto(user).getUserInformation(),
		};
	}
}
