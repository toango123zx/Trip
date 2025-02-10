import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HealthCheckRepository } from '../../healthCheck.repository';
import { GetHealthCheckQuery } from '../implements';

@QueryHandler(GetHealthCheckQuery)
export class GetHealthCheckHandler implements IQueryHandler<GetHealthCheckQuery> {
	constructor(private readonly healthCheckRepsitory: HealthCheckRepository) {}
	async execute(): Promise<string> {
		const connectDatabase = await this.healthCheckRepsitory.getConection();
		if (!connectDatabase) {
			throw Error('Database connection failed!');
		}
		return 'Okey';
	}
}
