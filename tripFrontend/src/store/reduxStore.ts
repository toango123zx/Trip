import { configureStore } from '@reduxjs/toolkit';

import {
	authSlice,
	scheduleSlice,
	discountSlice,
	productSlice,
	userSlice,
	discountTypeSlice,
	discountApplicationScopeSlice,
	discountEligibilitySlice,
} from '@/features';
import { locationSlice } from '@/features/location';
import salesReducer from '@/features/sales/slice/salesSlice';

export const _reduxStore = configureStore({
	reducer: {
		account: authSlice.reducer,
		location: locationSlice.reducer,
		product: productSlice.reducer,
		schedule: scheduleSlice.reducer,
		user: userSlice.reducer,
		discount: discountSlice.reducer,
		discountType: discountTypeSlice.reducer,
		discountApplicationScope: discountApplicationScopeSlice.reducer,
		discountEligibility: discountEligibilitySlice.reducer,
		sales: salesReducer,
	},
});

export type TReduxStore = typeof _reduxStore;
export type TReduxStoreDispatch = typeof _reduxStore.dispatch;
export type TReduxStoreState = ReturnType<typeof _reduxStore.getState>;
export type RootState = TReduxStoreState;
export type AppDispatch = TReduxStoreDispatch;
