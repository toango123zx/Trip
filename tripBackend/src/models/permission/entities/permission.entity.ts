import { permissionStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { InfoPermissionEntity } from '../../info_permission/entities/info_permission.entity';

export class PermissionEntity {
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
		enum: permissionStatusEnum,
	})
	status: permissionStatusEnum;
	@ApiProperty({
		type: () => InfoPermissionEntity,
		isArray: true,
		required: false,
	})
	infoPermission?: InfoPermissionEntity[];
}
