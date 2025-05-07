import { Injectable, OnModuleInit } from '@nestjs/common';

import { PermissionForAdminEnum, PermissionForSupplierEnum, RoleEnum } from 'src/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit(): Promise<void> {
		await this.seedRoles();
		await this.seedPermissions();
		await this.seedPermissionsForAdmin();
		await this.seedPermissionsForSupplier();
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
					{ name: 'supplier', description: 'supplier' },
					{ name: 'tourist', description: 'tourist' },
				],
			});
		}

		return;
	}

	private async seedPermissions(): Promise<void> {
		const PERMISSIONS: string[] = Object.values(PermissionForAdminEnum);

		const permissions = await this.prisma.permission.findMany();
		const permissionNamesDB = permissions.map((permission) => permission.name);
		const permissionNames = PERMISSIONS.filter((permissionName) => {
			return !permissionNamesDB.includes(permissionName);
		});
		if (permissionNames.length === 0) {
			return;
		}
		const permissionsData = permissionNames.map((permission) => ({
			name: permission,
			description: permission.replaceAll('_', ' '),
		}));
		await this.prisma.permission.createMany({
			data: permissionsData,
			skipDuplicates: true,
		});

		return;
	}

	private async seedPermissionsForAdmin(): Promise<void> {
		const PERMISSIONS: string[] = Object.values(PermissionForAdminEnum);

		const role = await this.prisma.role.findFirst({
			where: { name: RoleEnum.Admin },
		});

		const infoPermissions = await this.prisma.infoPermission.findMany({
			include: {
				permission: true,
			},
			where: {
				role_id: role.id,
			},
		});

		const missingPermissionsName = PERMISSIONS.filter((permissionName) => {
			return !infoPermissions.some(
				(infoPermission) => infoPermission.permission.name === permissionName,
			);
		});

		if (missingPermissionsName.length === 0) {
			return;
		}

		const missingPermissions = await this.prisma.permission.findMany({
			where: {
				name: {
					in: missingPermissionsName,
				},
			},
		});

		const InfoPermissionForAdmin = missingPermissions.map((permission) => ({
			role_id: role.id,
			permission_id: permission.id,
			description: `${permission.name.replaceAll('_', ' ')} for admin Role`,
		}));
		await this.prisma.infoPermission.createMany({
			data: InfoPermissionForAdmin,
		});

		return;
	}

	private async seedPermissionsForSupplier(): Promise<void> {
		const PERMISSIONS: string[] = Object.values(PermissionForSupplierEnum);

		const role = await this.prisma.role.findFirst({
			where: { name: RoleEnum.Supplier },
		});

		const infoPermissions = await this.prisma.infoPermission.findMany({
			include: {
				permission: true,
			},
			where: {
				role_id: role.id,
			},
		});

		const missingPermissionsName = PERMISSIONS.filter((permissionName) => {
			return !infoPermissions.some(
				(infoPermission) => infoPermission.permission.name === permissionName,
			);
		});

		if (missingPermissionsName.length === 0) {
			return;
		}

		const missingPermissions = await this.prisma.permission.findMany({
			where: {
				name: {
					in: missingPermissionsName,
				},
			},
		});

		const InfoPermissionForSupplier = missingPermissions.map((permission) => ({
			role_id: role.id,
			permission_id: permission.id,
			description: `${permission.name.replaceAll('_', ' ')} for supplier Role`,
		}));
		await this.prisma.infoPermission.createMany({
			data: InfoPermissionForSupplier,
		});

		return;
	}
}
