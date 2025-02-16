import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';

import { UserInformationDto } from '../../dtos';
import { GetMeQuery } from '../implements';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
	async execute(
		query: GetMeQuery,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto>> {
		const { roleId, role, permission, ...user } = query.userInformation;
		user.roleName = role?.name;

		return {
			success: true,
			data: query.userInformation,
		};
	}
}
