import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { BillStatusEnum, UserStatusEnum } from '@prisma/client';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	PaginationUtils,
	RoleEnum,
} from 'src/common';

import { UserRepository } from 'src/modules/user/user.repository';

import { GetUsersByProductScheduleIdResponseDto } from '../../dtos';
import { ProductScheduleRepository } from '../../productSchedule.repository';
import { GetUsersByProductScheduleIdQuery } from '../implements';

@QueryHandler(GetUsersByProductScheduleIdQuery)
export class GetUsersByProductScheduleIdHandler
	implements IQueryHandler<GetUsersByProductScheduleIdQuery>
{
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		query: GetUsersByProductScheduleIdQuery,
	): Promise<
		| HttpResponseBodySuccessDto<GetUsersByProductScheduleIdResponseDto[]>
		| HttpException
	> {
		const { productScheduleId, myInformation, pagination, filter } = query;

		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const productSchedule =
			await this.productScheduleRepository.findProductScheduleByProductScheduleId(
				productScheduleId,
			);

		if (!productSchedule) {
			return new NotFoundException('productScheduleId');
		}

		if (
			productSchedule.product?.supplier?.userId !== myInformation.id &&
			myInformation.roleName.includes(RoleEnum.Admin)
		) {
			return new ForbiddenException();
		}

		const [users, totalRecords] =
			await this.userRepository.findUsersInProductSchedulebyProductScheduleId(
				productScheduleId,
				undefined,
				[BillStatusEnum.pending, BillStatusEnum.paid, BillStatusEnum.done],
				[UserStatusEnum.active],
				page,
				filter,
			);

		const usersInformation = users
			.map((user) => {
				if (user.bill.length > 1) {
					return user.bill.map((bill) => {
						return new GetUsersByProductScheduleIdResponseDto({
							...user,
							bill: [bill],
						});
					});
				}
			})
			.flat();

		return {
			success: true,
			data: usersInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
