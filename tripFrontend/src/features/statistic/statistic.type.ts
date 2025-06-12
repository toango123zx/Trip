import { EStatisticTimeUnit } from "@/types";

export type TStatisticState = {
	revenueData: TReSponseStatistic[];
	bookedData: TReSponseStatistic[];
	loading: boolean;
	error: string | null;
};

export type TRequestQueryQueryStatistic = {
	productId?: string;
	timeUnit: EStatisticTimeUnit;
	startTimeSearch: Date;
	endTimeSearch: Date;
};

export type TReSponseStatistic = {
	timePoint: string;
	value: number;
};
