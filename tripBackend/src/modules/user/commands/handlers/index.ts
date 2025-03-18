import { CreateUserHandler } from './createUser.handler';
import { LockUserByUserdHandler } from './lockUserByUserId.handler';
import { ResetUserPasswordHandler } from './resetUserPassword.handler';
import { UnlockUserByUserIdHandler } from './unlockUserByUserId.handler';
import { UpdateMyInformationHandler } from './updateMyInformation';
import { UpdateMyPasswordHandler } from './updateMyPassword.handler';
import { UpdateUserInformationByUserIdHandler } from './updateUserInformationByUserId.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	LockUserByUserdHandler,
	ResetUserPasswordHandler,
	UnlockUserByUserIdHandler,
	UpdateMyInformationHandler,
	UpdateMyPasswordHandler,
	UpdateUserInformationByUserIdHandler,
];
