import { MessageEntity } from 'src/models';

export class GetMessageResponseDto {
	id: string;
	content: string;
	userId: string;
	userName: string;
	image: string;
	userRoleName: string;
	createAt: Date;
	updateAt: Date;

	constructor(message: MessageEntity) {
		this.id = message.id;
		this.content = message.content;
		this.userId = message.userId;
		this.userName = message.user?.name || '';
		this.image = message.user?.image || '';
		this.userRoleName = message.user?.role?.name || '';
		this.createAt = message.createAt;
		this.updateAt = message.updateAt;
	}
}
