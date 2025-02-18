import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit(): Promise<void> {
		await this.seedRoles();
	}

	private async seedRoles(): Promise<void> {
		const ROLE = ['admin', 'tourist', 'supplier'];

		const roles = await this.prisma.role.findMany();
		const rolesName = roles.map((role) => role.name);
		const flag = rolesName.every((item) => ROLE.includes(item));

		if (!flag) {
			await this.prisma.role.createMany({
				data: [
					{ name: 'admin', description: 'admin' },
					{ name: 'tourist', description: 'tourist' },
				],
			});
		}
	}
}
