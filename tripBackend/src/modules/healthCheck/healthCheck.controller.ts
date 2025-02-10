import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { GetHealthCheckQuery } from './queries/implements/getHealthCheck.query';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async healthCheck(): Promise<string> {
		return this.queryBus.execute(new GetHealthCheckQuery());
	}
}
