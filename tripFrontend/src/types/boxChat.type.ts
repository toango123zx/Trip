type TAttractionReferenceInMessage = {
    id: string;
    name: string;
    image: string;
}

export type TMessage = {
    id: string;
    content: string;
    userId: string;
    userName: string;
    image: string;
    userRoleName: string;
    createAt: Date;
    updateAt: Date;
    attractionReference?: TAttractionReferenceInMessage[];
}


export type TBoxChatMember = {
    userId: string;
    userName: string;
    image: string;
    roleName: string;
}

export type TBoxChat = {
    id: string;
    name: string;
    boxChatMember: TBoxChatMember[];
    messages: TMessage[];
}

export type TBoxChatSummary = {
    id: string;
    name: string;
    boxChatMember: TBoxChatMember[];
}