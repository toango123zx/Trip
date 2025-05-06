import { configureStore } from '@reduxjs/toolkit';

import { authSlice, userSlice } from '@/features';
import { locationSlice } from '@/features/location';
import { productSlice } from '@/features/product';

export const _reduxStore = configureStore({
	reducer: {
		account: authSlice.reducer,
		location: locationSlice.reducer,
		product: productSlice.reducer,
		user: userSlice.reducer,
	},
});

export type TReduxStore = typeof _reduxStore;
export type TReduxStoreDispatch = typeof _reduxStore.dispatch;
export type TReduxStoreState = ReturnType<typeof _reduxStore.getState>;
