import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@/features';

export const _reduxStore = configureStore({
	reducer: {
		account: authSlice.reducer,
	},
});

export type TReduxStore = typeof _reduxStore;
export type TReduxStoreDispatch = typeof _reduxStore.dispatch;
export type TReduxStoreState = ReturnType<typeof _reduxStore.getState>;
