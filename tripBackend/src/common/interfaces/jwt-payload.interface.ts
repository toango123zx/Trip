export interface IJwtPayload {
	accountId: string;
	userId: string;
	roles: Array<string>;
	permissions: Array<string>;
}
