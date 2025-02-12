import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { UserEntity } from 'src/models';

import { UserRepository } from '../../user.repository';
import { GetUsersQuery } from '../implements';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUsersQuery,
	): Promise<HttpResponseBodySuccessDto<UserEntity[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};
		const [users, totalRecords] = await this.userRepository.findUsers(pagination);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: users,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: users.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
