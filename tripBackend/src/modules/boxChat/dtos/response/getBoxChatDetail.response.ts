import { BoxChatEntity } from 'src/models';

import { GetBoxChatResponseDto } from './getBoxChat.response';

export class GetBoxChatDetailResponseDto extends GetBoxChatResponseDto {
	messages: {
		id: string;
		content: string;
		userId: string;
		userName: string;
		image: string;
		userRoleName: string;
		createAt: Date;
		updateAt: Date;
	}[];

	constructor(boxChat: BoxChatEntity) {
		super(boxChat);
		this.messages = boxChat.message?.map((msg) => ({
			id: msg.id,
			content: msg.content,
			userId: msg.userId,
			userName: boxChat.boxChatMember.find((member) => member.userId === msg.userId)
				?.user?.name,
			image: boxChat.boxChatMember.find((member) => member.userId === msg.userId)
				?.user?.image,
			userRoleName: boxChat.boxChatMember.find(
				(member) => member.userId === msg.userId,
			)?.user?.role?.name,
			createAt: msg.createAt,
			updateAt: msg.updateAt,
		}));
	}
}
