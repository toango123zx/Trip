import { CreateUserHandler } from './createUser.handler';
import { LockUserByUserdHandler } from './lockUserByUserId.handler';
import { ResetUserPasswordHandler } from './resetUserPassword.handler';
import { UpdateMyInformationHandler } from './updateMyInformation';
import { UpdateMyPasswordHandler } from './updateMyPassword.handler';
import { UpdateUserInformationByUserIdHandler } from './updateUserInformationByUserId.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	LockUserByUserdHandler,
	ResetUserPasswordHandler,
	UpdateMyInformationHandler,
	UpdateMyPasswordHandler,
	UpdateUserInformationByUserIdHandler,
];
