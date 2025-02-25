import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';

import { UserInformationDto } from '../../dtos';
import { GetMeQuery } from '../implements';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
	async execute(
		query: GetMeQuery,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto>> {
		const user: UserInformationDto = query.userInformation;
		user.roleName = user.role?.name;
		delete user.role;
		delete user.roleId;
		delete user.permission;

		return {
			success: true,
			data: query.userInformation,
		};
	}
}
