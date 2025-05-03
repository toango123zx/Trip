import { createAsyncThunk } from '@reduxjs/toolkit';

import { TLocation, TPagination } from '@/types';

import { TRequestQueryGetLocations } from './location.type';
import { locationApi } from './locationApi';

const getLocations = createAsyncThunk(
	'location/getLocations',
	async (query?: TRequestQueryGetLocations): Promise<[TLocation[], TPagination?]> => {
		const [data, pagination] = await locationApi.getLocations(query);
		return [data, pagination];
	},
);

export const locationThunk = {
	getLocations,
};
