import { ICommand } from '@nestjs/cqrs';

import { UpdateMyInformationRequestDto, UserInformationDto } from '../../dtos';

export class UpdateMyInformationCommand implements ICommand {
	constructor(
		public readonly updateMyInformationDataRequest: UpdateMyInformationRequestDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
