import { CityEnum, LocationStatusEnum } from '@prisma/client';
import { LocationEntity } from 'src/models';

export class GetLocationResponseDto {
	id: string;
	systemName: string;
	displayName: string;
	city: CityEnum;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: LocationStatusEnum;

	constructor(location: LocationEntity) {
		this.id = location.id;
		this.systemName = location.systemName;
		this.displayName = location.displayName;
		this.city = location.city;
		this.createAt = location.createAt;
		this.updateAt = location.updateAt;
		this.deletedAt = location.deletedAt;
		this.status = location.status;
	}
}
