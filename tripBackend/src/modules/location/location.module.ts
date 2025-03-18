import { Module } from '@nestjs/common';

import { LocationRepository } from './location.repository';

@Module({
	imports: [],
	controllers: [],
	providers: [LocationRepository],
	exports: [],
})
export class LocationModule {}
