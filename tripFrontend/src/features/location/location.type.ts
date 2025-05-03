import { EArrange, ELocationStatus, TLocation, TPagination } from '@/types';

export type TLocationState = {
	locations: TLocation[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetLocations = {
	page?: number;
	limit?: number;
	keyword?: string;
	systemName?: EArrange;
	displayName?: EArrange;
	city?: string;
	status?: ELocationStatus;
};
