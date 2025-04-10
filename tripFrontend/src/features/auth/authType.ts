import { TAccount } from '@/types';

export type TAuthState = {
	account: TAccount[];
	loading: boolean;
	error: string | null;
};
