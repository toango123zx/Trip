import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';

import { OptionalException } from 'src/common';

export const SupplierInformation = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const { id, ...user } = request.user;
		let supplier = request.supplier;
		if (!supplier) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'This feature requires you to be a supplier.',
			);
		}

		supplier = {
			userId: id,
			...user,
			supplier: {
				...supplier,
			},
		};
		return supplier;
	},
);
