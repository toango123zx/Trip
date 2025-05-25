import { UserStatusEnum } from '@prisma/client';
import { UserEntity } from 'src/models';

export class GetUsersResponseDto {
	id: string;
	name: string;
	email: string;
	gender: string;
	phoneNumber: string;
	address: string;
	image: string;
	dateOfBirth: Date;
	status: UserStatusEnum;

	constructor(user: UserEntity) {
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
		this.gender = user.gender;
		this.phoneNumber = user.phoneNumber;
		this.address = user.address;
		this.image = user.image;
		this.dateOfBirth = user.dateOfBirth;
		this.status = user.status;
	}
}
