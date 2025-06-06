import { BoxChatEntity } from 'src/models';

export class GetBoxChatResponseDto {
	id: string;
	name: string;
	boxChatMember: {
		userId: string;
		userName: string;
		image: string;

		roleName: string;
	}[];

	constructor(boxChat: BoxChatEntity) {
		this.id = boxChat.id;
		this.name = boxChat.name;
		this.boxChatMember = boxChat.boxChatMember.map((member) => ({
			userId: member.userId,
			userName: member.user?.name,
			image: member.user?.image,
			roleName: member.user?.role?.name,
		}));
	}
}
