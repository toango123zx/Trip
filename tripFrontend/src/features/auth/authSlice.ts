import { createSlice } from '@reduxjs/toolkit';

import { TAuthState } from './authType';

const initialStateL: TAuthState = {
	account: [],
	loading: false,
	error: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialStateL,
	reducers: {},
});
