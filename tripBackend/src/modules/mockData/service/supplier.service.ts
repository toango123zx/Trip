import { GenderUserEnum } from '@prisma/client';
import { RoleEnum } from 'src/common';
import { PrismaService } from 'src/modules/database/services';

import { suppliers } from '../data/supplier.data';

const primaSerivce = new PrismaService();

const randomDateOfBirth = (): Date => {
	const now = new Date();
	now.setFullYear(now.getFullYear() - 10);
	const past = new Date();
	past.setFullYear(now.getFullYear() - 90);

	const randomTimestamp =
		past.getTime() + Math.random() * (now.getTime() - past.getTime());
	return new Date(randomTimestamp);
};

export const mockSuppliersDataService = async (): Promise<void> => {
	const supplierRole = await primaSerivce.role.findFirst({
		where: {
			name: RoleEnum.Supplier,
		},
	});

	await Promise.all(
		suppliers.map((supplier, index) => {
			return primaSerivce.user.create({
				data: {
					name: supplier.name,
					email: supplier.email,
					role: {
						connect: {
							id: supplierRole.id,
						},
					},
					address: supplier.address,
					gender: supplier.gender as GenderUserEnum,
					image: supplier.image,
					phoneNumber: supplier.phoneNumber,
					dateOfBirth: randomDateOfBirth(),
					account: {
						create: {
							username: supplier.username,
							password:
								'$2b$10$tR5wT7GVmhQnhmZERrcocO8NcVt8g6Wr.OHpg.cc/IP46Bl5wVwQ2', // Supplier@1
							salt: '$2b$10$tR5wT7GVmhQnhmZERrcocO',
						},
					},
					supplier: {
						create: {
							taxId: index.toString().padStart(13, '0'),
						},
					},
				},
			});
		}),
	);
};
