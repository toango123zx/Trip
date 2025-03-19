import { ApiProperty } from '@nestjs/swagger';

import { PermissionEntity } from '../../permission/entities/permission.entity';
import { RoleEntity } from '../../role/entities/role.entity';

export class InfoPermissionEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	role_id: string;
	@ApiProperty({
		type: () => RoleEntity,
		required: false,
	})
	role?: RoleEntity;
	@ApiProperty({
		type: 'string',
	})
	permission_id: string;
	@ApiProperty({
		type: () => PermissionEntity,
		required: false,
	})
	permission?: PermissionEntity;
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
}
