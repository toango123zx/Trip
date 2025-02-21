import { GetMeHandler } from './getMe.handler';
import { GetUserByUserIdHandler } from './getUserByUserId.handler';
import { GetUsersHandler } from './getUsers.handler';

export const UserQueryHandlers = [GetMeHandler, GetUserByUserIdHandler, GetUsersHandler];
