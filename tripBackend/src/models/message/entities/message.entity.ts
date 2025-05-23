import { ApiProperty } from '@nestjs/swagger';

import { BoxChatEntity } from '../../boxChat/entities/boxChat.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class MessageEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	content: string;
	@ApiProperty({
		type: 'string',
	})
	userId: string;
	@ApiProperty({
		type: () => UserEntity,
		required: false,
	})
	User?: UserEntity;
	@ApiProperty({
		type: 'string',
	})
	boxChatId: string;
	@ApiProperty({
		type: () => BoxChatEntity,
		required: false,
	})
	boxChat?: BoxChatEntity;
	@ApiProperty({
		type: 'boolean',
	})
	isRead: boolean;
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
