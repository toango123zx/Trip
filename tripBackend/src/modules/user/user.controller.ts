import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
	HttpResponseBodyDto,
	HttpResponseBodyFailDto,
	HttpResponseBodySuccessDto,
	PaginationDto,
} from 'src/common';
import { PermissionEnum, RoleEnum } from 'src/common/enums';

import { Auth, AuthPermission, AuthRole } from '../auth/decorators';

import {
	CreateUserCommand,
	LockUserByUserIdCommand,
	ResetUserPasswordCommand,
	UnlockUserByUserIdCommand,
	UpdateMyInformationCommand,
	UpdateMyPasswordComand,
	UpdateUserInformationByUserIdCommand,
} from './commands/implements';
import {
	CreateUserRequestDto,
	ResetUserPasswordResponseDto,
	UpdateMyInformationRequestDto,
	UpdateMyPasswordRequestDto,
	UpdateUserInformationByUserIdRequestDto,
	UserInformationDto,
} from './dtos';
import { UserFilterRequestDto } from './dtos/requests/userFilter.request';
import { MyInforamtion } from './guards';
import { GetMeQuery, GetUserByUserIdQuery, GetUsersQuery } from './queries/implements';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@ApiOperation({ summary: 'Get paginated list of users for tadmin' })
	@AuthRole(RoleEnum.Admin)
	async getUsers(
		@Query() pagination: PaginationDto,
		@Query() filter?: UserFilterRequestDto,
	): Promise<HttpResponseBodyDto<UserInformationDto[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination, filter));
	}

	@Get('/me')
	@Auth()
	async getMe(
		@MyInforamtion() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.queryBus.execute(new GetMeQuery(userInformation));
	}

	@Get('/:userId')
	@AuthPermission(PermissionEnum.FindUser)
	async findUserByUserId(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.queryBus.execute(new GetUserByUserIdQuery(userId));
	}

	@Post()
	@AuthPermission(PermissionEnum.CreateUser)
	async createUser(
		@Body() user: CreateUserRequestDto,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.commandBus.execute(new CreateUserCommand(user));
	}

	@Put()
	@Auth()
	async updateMyInformation(
		@Body() updateMyInformationDataRequest: UpdateMyInformationRequestDto,
		@MyInforamtion() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.commandBus.execute(
			new UpdateMyInformationCommand(updateMyInformationDataRequest, myInformation),
		);
	}

	@Put('/:userId')
	@AuthPermission(PermissionEnum.UpdateUserInformation)
	async updateUserInformationByUserId(
		@Param('userId') userId: string,
		@Body() updateUserDataRequest: UpdateUserInformationByUserIdRequestDto,
	): Promise<HttpResponseBodyDto<UserInformationDto | HttpException>> {
		return this.commandBus.execute(
			new UpdateUserInformationByUserIdCommand(userId, updateUserDataRequest),
		);
	}

	@HttpCode(204)
	@Patch('/change-password')
	@Auth()
	async updateMyPassword(
		@Body() updateMyPasswordRequest: UpdateMyPasswordRequestDto,
		@MyInforamtion() userInformation: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto | HttpResponseBodyFailDto> {
		return this.commandBus.execute(
			new UpdateMyPasswordComand(
				updateMyPasswordRequest.currentPassword,
				updateMyPasswordRequest.newPassword,
				userInformation,
			),
		);
	}

	@Patch('/:userId/reset-password')
	@AuthPermission(PermissionEnum.ResetUserPassword)
	async resetUserPassword(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<ResetUserPasswordResponseDto | HttpException>> {
		return this.commandBus.execute(new ResetUserPasswordCommand(userId));
	}

	@Patch('/:userId/lock')
	@AuthPermission(PermissionEnum.LockUser)
	async lockUserByUserId(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UserInformationDto> | HttpException> {
		return this.commandBus.execute(new LockUserByUserIdCommand(userId));
	}

	@Patch('/:userId/unlock')
	@AuthPermission(PermissionEnum.UnlockUser)
	async unlockUserByUserId(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UserInformationDto> | HttpException> {
		return this.commandBus.execute(new UnlockUserByUserIdCommand(userId));
	}
}
