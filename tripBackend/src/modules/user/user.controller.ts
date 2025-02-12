import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { RoleEnum } from 'src/common/enums';
import { UserEntity } from 'src/models';

import { AuthRole } from '../auth/decorators';

import { GetUsersQuery } from './queries/implements';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@AuthRole(RoleEnum.Admin)
	async getUsers(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<UserEntity[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination));
	}
}
