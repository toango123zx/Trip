import { CreateUserHandler } from './createUser.handler';
import { ResetUserPasswordHandler } from './resetUserPassword.handler';
import { UpdateUserInformationByUserIdHandler } from './updateUserInformationByUserId.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	ResetUserPasswordHandler,
	UpdateUserInformationByUserIdHandler,
];
