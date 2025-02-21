import { Injectable, OnModuleInit } from '@nestjs/common';

import { PermissionEnum, RoleEnum } from 'src/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit(): Promise<void> {
		await this.seedRoles();
		await this.seedPermissions();
	}

	private async seedRoles(): Promise<void> {
		const ROLE: string[] = Object.values(RoleEnum);

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

		return;
	}

	private async seedPermissions(): Promise<void> {
		const PERMISSIONS: string[] = Object.values(PermissionEnum);

		const permissions = await this.prisma.permission.findMany();
		const permissionNamesDB = permissions.map((permission) => permission.name);
		const permissionNames = PERMISSIONS.filter((permissionName) => {
			return !permissionNamesDB.includes(permissionName);
		});
		if (!permissionNames) {
			return;
		}
		const adminRole = await this.prisma.role.findFirst({
			where: { name: RoleEnum.Admin },
		});
		const permissionsData = permissionNames.map((permission) => ({
			name: permission,
			description: permission.replaceAll('_', ' '),
			infoPermission: {
				create: {
					role: {
						connect: {
							id: adminRole.id,
						},
					},
					description: `${permission.replaceAll('_', ' ')} for admin Role`,
				},
			},
		}));
		await Promise.all(
			permissionsData.map(async (permission) =>
				this.prisma.permission.create({
					data: permission,
				}),
			),
		);

		return;
	}
}
