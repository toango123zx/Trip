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
import salesReducer from '@/features/sales/slice/salesSlice';
import { boxChatSlice } from '@/features/boxChat';
import { statisticSlice } from '@/features/statistic';

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
		cart: cartSlice.reducer,
		bill: billSlice.reducer,
		boxChat: boxChatSlice.reducer,
		statistic: statisticSlice.reducer,
	},
});

export type TReduxStore = typeof _reduxStore;
export type TReduxStoreDispatch = typeof _reduxStore.dispatch;
export type TReduxStoreState = ReturnType<typeof _reduxStore.getState>;
export type RootState = TReduxStoreState;
export type AppDispatch = TReduxStoreDispatch;
