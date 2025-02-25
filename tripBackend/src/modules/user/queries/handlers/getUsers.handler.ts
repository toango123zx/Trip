import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';

import { UserInformationDto, UserOrderByDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { GetUsersQuery } from '../implements';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUsersQuery,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const { roleName, ...userFilter } = query.filter;
		const userOrderBy: UserOrderByDto = {
			...userFilter,
			...(roleName && {
				role: {
					name: roleName,
				},
			}),
		};

		const [users, totalRecords] = await this.userRepository.findUsers(
			pagination,
			userOrderBy,
		);
		const usersInformation = users.map((user) =>
			new UserInformationDto(user).getUserInformation(),
		);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: usersInformation,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: users.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
