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
	cartSlice,
	billSlice,
} from '@/features';
import { locationSlice } from '@/features/location';

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
		cart: cartSlice.reducer,
		bill: billSlice.reducer,
	},
});

export type TReduxStore = typeof _reduxStore;
export type TReduxStoreDispatch = typeof _reduxStore.dispatch;
export type TReduxStoreState = ReturnType<typeof _reduxStore.getState>;
