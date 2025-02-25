import { CreateUserHandler } from './createUser.handler';
import { ResetUserPasswordHandler } from './resetUserPassword.handler';

export const UserCommandHandlers = [CreateUserHandler, ResetUserPasswordHandler];
