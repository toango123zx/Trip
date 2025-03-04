import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	ObjectComparerDto,
} from 'src/common';
import { UserEntity } from 'src/models';

import { UpdateMyInformationRequestDto, UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { UpdateMyInformationCommand } from '../implements';

@CommandHandler(UpdateMyInformationCommand)
export class UpdateMyInformationHandler
	implements ICommandHandler<UpdateMyInformationCommand>
{
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		command: UpdateMyInformationCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const { updateMyInformationDataRequest, myInformation } = command;

		const updateUserData = new ObjectComparerDto<UserEntity>(
			myInformation,
		).getUpdatedFields<UpdateMyInformationRequestDto>(updateMyInformationDataRequest);

		if (!updateUserData) {
			return {
				success: true,
				data: new UserInformationDto(myInformation).getUserInformation(),
			};
		}

		if (updateUserData.email) {
			const userByEmail = await this.userRepository.findUserByEmail(
				updateUserData.email,
			);
			if (userByEmail) {
				throw new ConflictException('email');
			}
		}

		const updatedUser = await this.userRepository.updateUserByUserId(
			myInformation.id,
			updateUserData,
		);

		return {
			success: true,
			data: new UserInformationDto(updatedUser).getUserInformation(),
		};
	}
}
