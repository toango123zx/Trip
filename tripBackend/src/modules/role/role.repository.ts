import { Injectable } from '@nestjs/common';

import { RoleEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class RoleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getRoleByName(name: string): Promise<RoleEntity> {
		try {
			return this.prismaService.role.findFirst({
				where: {
					name: name,
					status: 'active',
				},
			});
		} catch (error) {
			return error;
		}
	}
}
