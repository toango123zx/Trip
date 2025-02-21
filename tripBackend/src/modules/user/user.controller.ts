import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { RoleEnum } from 'src/common/enums';
import { UserEntity } from 'src/models';

import { Auth, AuthRole } from '../auth/decorators';

import { UserInformationDto } from './dtos';
import { UserFilterRequestDto } from './dtos/requests/userFilter.request';
import { MyInforamtion } from './guards';
import { GetMeQuery, GetUserQuery, GetUsersQuery } from './queries/implements';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@ApiOperation({ summary: 'Get paginated list of users for admin' })
	@AuthRole(RoleEnum.Admin)
	async getUsers(
		@Query() pagination: PaginationDto,
		@Query() filter?: UserFilterRequestDto,
	): Promise<HttpResponseBodyDto<UserEntity[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination, filter));
	}

	@Get('/me')
	@AuthRole(RoleEnum.Admin)
	async getMe(
		@MyInforamtion() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.queryBus.execute(new GetMeQuery(userInformation));
	}

	@Get('/:userId')
	@Auth()
	async getUser(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UserEntity | HttpException>> {
		return this.queryBus.execute(new GetUserQuery(userId));
	}
}
