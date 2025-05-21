import { Injectable, OnModuleInit } from '@nestjs/common';

import {
	DiscountApplicationScopeEnum,
	DiscountEligibilityEnum,
	DiscountTypeEnum,
	PaymentMethodEnum,
	PermissionForAdminEnum,
	PermissionForSupplierEnum,
	RoleEnum,
} from 'src/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit(): Promise<void> {
		await this.seedRoles();
		await this.seedPermissions();
		await this.seedPermissionsForAdmin();
		await this.seedPermissionsForSupplier();
		await this.seedDiscountTypes();
		await this.seedDiscountEligibilities();
		await this.seedDiscountApplicationScopes();
		await this.seedPaymentMethod();
	}

	private async seedRoles(): Promise<void> {
		const ROLE: string[] = Object.values(RoleEnum);

		const roles = await this.prisma.role.findMany();
		const rolesName = roles.map((role) => role.name);
		const flag =
			roles.length === 0 ? false : rolesName.every((item) => ROLE.includes(item));

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

	private async seedDiscountTypes(): Promise<void> {
		const DISCOUNT_TYPES: string[] = Object.values(DiscountTypeEnum);

		const discountTypes = await this.prisma.discountType.findMany();
		const discountTypeNamesDB = discountTypes.map(
			(discountType) => discountType.name,
		);
		const discountTypeNames = DISCOUNT_TYPES.filter((discountTypeName) => {
			return !discountTypeNamesDB.includes(discountTypeName);
		});
		if (discountTypeNames.length === 0) {
			return;
		}
		const discountTypesData = discountTypeNames.map((discountType) => ({
			name: discountType,
			description: discountType.replaceAll('_', ' '),
		}));
		await this.prisma.discountType.createMany({
			data: discountTypesData,
		});

		return;
	}

	private async seedDiscountEligibilities(): Promise<void> {
		const DISCOUNT_ELIGIBILITYS: string[] = Object.values(DiscountEligibilityEnum);

		const discountEligibilities = await this.prisma.discountEligibility.findMany();
		const discountEligibilityNamesDB = discountEligibilities.map(
			(discountApplicationScope) => discountApplicationScope.name,
		);
		const discountEligibilityNames = DISCOUNT_ELIGIBILITYS.filter(
			(discountEligibilityName) => {
				return !discountEligibilityNamesDB.includes(discountEligibilityName);
			},
		);
		if (discountEligibilityNames.length === 0) {
			return;
		}
		const discountEligibilitiesData = discountEligibilityNames.map(
			(discountEligibilityName) => ({
				name: discountEligibilityName,
				description: discountEligibilityName.replaceAll('_', ' '),
			}),
		);
		await this.prisma.discountEligibility.createMany({
			data: discountEligibilitiesData,
		});

		return;
	}

	private async seedDiscountApplicationScopes(): Promise<void> {
		const DISCOUNT_APPLICATION_SCOPES: string[] = Object.values(
			DiscountApplicationScopeEnum,
		);

		const discountApplicationScopes =
			await this.prisma.discountApplicationScope.findMany();
		const discountApplicationScopeNamesDB = discountApplicationScopes.map(
			(discountApplicationScope) => discountApplicationScope.name,
		);
		const discountApplicationScopeNames = DISCOUNT_APPLICATION_SCOPES.filter(
			(discountApplicationScopeName) => {
				return !discountApplicationScopeNamesDB.includes(
					discountApplicationScopeName,
				);
			},
		);
		if (discountApplicationScopeNames.length === 0) {
			return;
		}
		const discountApplicationScopesData = discountApplicationScopeNames.map(
			(discountApplicationScopeName) => ({
				name: discountApplicationScopeName,
				description: discountApplicationScopeName.replaceAll('_', ' '),
			}),
		);
		await this.prisma.discountApplicationScope.createMany({
			data: discountApplicationScopesData,
		});

		return;
	}
	private async seedPaymentMethod(): Promise<void> {
		const PAYMENT_METHODS: string[] = Object.values(PaymentMethodEnum);

		const paymentMethodds = await this.prisma.paymentMethod.findMany();
		const paymentMethodNamesDB = paymentMethodds.map(
			(paymentMethod) => paymentMethod.name,
		);
		const paymentMethodNames = PAYMENT_METHODS.filter((paymentMethodName) => {
			return !paymentMethodNamesDB.includes(paymentMethodName);
		});
		if (paymentMethodNames.length === 0) {
			return;
		}
		const paymentMethodData = paymentMethodNames.map((paymentMethodName) => ({
			name: paymentMethodName,
			description: paymentMethodName.replaceAll('_', ' '),
		}));
		await this.prisma.paymentMethod.createMany({
			data: paymentMethodData,
		});

		return;
	}
}
