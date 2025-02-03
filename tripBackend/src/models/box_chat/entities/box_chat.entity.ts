import { ApiProperty } from '@nestjs/swagger';

import { BoxChatMemberEntity } from '../../box_chat_member/entities/box_chat_member.entity';
import { MessageEntity } from '../../message/entities/message.entity';

export class BoxChatEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: () => BoxChatMemberEntity,
		isArray: true,
		required: false,
	})
	boxChatMember?: BoxChatMemberEntity[];
	@ApiProperty({
		type: () => MessageEntity,
		isArray: true,
		required: false,
	})
	message?: MessageEntity[];
}
