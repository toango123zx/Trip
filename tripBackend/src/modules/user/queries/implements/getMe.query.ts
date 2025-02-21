import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from '../../dtos';

export class GetMeQuery implements IQuery {
	constructor(public readonly userInformation: UserInformationDto) {}
}
