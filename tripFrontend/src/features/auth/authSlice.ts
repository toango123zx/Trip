import { createSlice } from '@reduxjs/toolkit';

import { TAuthState } from './authType';

const initialState: TAuthState = {
	account: [],
	loading: false,
	error: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {},
});
