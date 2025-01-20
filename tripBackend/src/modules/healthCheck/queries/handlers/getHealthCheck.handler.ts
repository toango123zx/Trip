import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetHealthCheckQuery } from '../implements';
import { HealthCheckRepository } from '../../healthCheck.repository';

@QueryHandler(GetHealthCheckQuery)
export class GetHealthCheckHandler implements IQueryHandler<GetHealthCheckQuery> {
	constructor(private readonly healthCheckRepsitory: HealthCheckRepository) {}
	async execute() {
		const connectDatabase = await this.healthCheckRepsitory.getConection();
		if (!connectDatabase) {
			throw Error('Database connection failed!');
		}
		return 'Okey';
	}
}
