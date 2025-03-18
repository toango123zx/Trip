import { ApiProperty } from '@nestjs/swagger';

import { RoleStatusEnum } from '@prisma/client';

import { InfoPermissionEntity } from '../../info_permission/entities/info_permission.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class RoleEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updateAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	deletedAt: Date | null;
	@ApiProperty({
		enum: RoleStatusEnum,
		enumName: 'RoleStatusEnum',
	})
	status: RoleStatusEnum;
	@ApiProperty({
		type: () => InfoPermissionEntity,
		isArray: true,
		required: false,
	})
	infoPermission?: InfoPermissionEntity[];
	@ApiProperty({
		type: () => UserEntity,
		isArray: true,
		required: false,
	})
	user?: UserEntity[];
}
