import { CityEnum, LocationStatusEnum, MapAddressStatusEnum } from '@prisma/client';
import { LocationEntity } from 'src/models';

class MapAddressResponse {
	id: string;
	urlMap: string;
	provider: string;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: MapAddressStatusEnum;
}

export class GetLocationResponseDto {
	id: string;
	systemName: string;
	displayName: string;
	city: CityEnum;
	mapAddress: MapAddressResponse;
	createAt: Date;
	updateAt: Date;
	deletedAt: Date | null;
	status: LocationStatusEnum;

	constructor(location: LocationEntity) {
		this.id = location.id;
		this.systemName = location.systemName;
		this.displayName = location.displayName;
		this.city = location.city;
		this.mapAddress = location.mapAddress
			? {
					id: location.mapAddress.id,
					urlMap: location.mapAddress.urlMap,
					provider: location.mapAddress.providerMap.name,
					createAt: location.mapAddress.createAt,
					updateAt: location.mapAddress.updateAt,
					deletedAt: location.mapAddress.deletedAt,
					status: location.mapAddress.status,
				}
			: null;
		this.createAt = location.createAt;
		this.updateAt = location.updateAt;
		this.deletedAt = location.deletedAt;
		this.status = location.status;
	}
}
