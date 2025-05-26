import { GenderUserEnum } from '@prisma/client';
import { RoleEnum } from 'src/common';
import { PrismaService } from 'src/modules/database/services';

import { tourists } from '../data/tourist.data';

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

export const mockTouristsDataService = async (): Promise<void> => {
	const touristRole = await primaSerivce.role.findFirst({
		where: {
			name: RoleEnum.Tourist,
		},
	});

	await Promise.all(
		tourists.map((tourist) => {
			return primaSerivce.user.create({
				data: {
					name: tourist.name,
					email: tourist.email,
					role: {
						connect: {
							id: touristRole.id,
						},
					},
					address: tourist.address,
					gender: tourist.gender as GenderUserEnum,
					image: tourist.image,
					phoneNumber: tourist.phoneNumber,
					dateOfBirth: randomDateOfBirth(),
					account: {
						create: {
							username: tourist.username,
							password:
								'$2b$10$j9Mj1UjLg9pPnYYcL/9OSuECeRWBpjYliHi0WmnZUtWKG0GskIw62', // User@1
							salt: '$2b$10$j9Mj1UjLg9pPnYYcL/9OSu',
						},
					},
				},
			});
		}),
	);
};
