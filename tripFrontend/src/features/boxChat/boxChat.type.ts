import { EArrange, TBoxChat, TBoxChatSummary, TPagination } from "@/types";

export type TBoxChatState = {
	boxChats: TBoxChatSummary[];
	boxChatDetail: TBoxChat;
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetBoxChats = {
	page?: number;
	limit?: number;
	nameSearch?: string;
	name?: EArrange;
};

export type TRequestQueryCreateBoxChat = {
	name: string;
	boxChatMember: string[];
};
