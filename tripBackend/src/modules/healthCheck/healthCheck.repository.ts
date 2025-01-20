import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/services';

@Injectable()
export class HealthCheckRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getConection() {
		try {
			await this.prismaService.$queryRaw`SELECT 1`;
			return true;
		} catch (error) {
			return false;
		}
	}
}
