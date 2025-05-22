import { TCartSummary, TPagination } from '@/types';

export type TCartState = {
	carts: TCartSummary[];
	cartDetail: TCartSummary;
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export class TRequestQueryGetCarts {
	page?: number;
	limit?: number;
	keyword?: string;
}
