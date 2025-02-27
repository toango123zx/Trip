import { CreateUserHandler } from './createUser.handler';
import { ResetUserPasswordHandler } from './resetUserPassword.handler';
import { UpdateMyInformationHandler } from './updateMyInformation';
import { UpdateUserInformationByUserIdHandler } from './updateUserInformationByUserId.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	ResetUserPasswordHandler,
	UpdateMyInformationHandler,
	UpdateUserInformationByUserIdHandler,
];
