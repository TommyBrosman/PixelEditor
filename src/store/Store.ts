import { configureStore } from "@reduxjs/toolkit";
import type { SharedTreeConnection } from "./Storage";
import { appReducer } from "./Reducers";

/**
 * The root store for the application.
 */
export const store = configureStore({
	reducer: appReducer,
	middleware: getDefaultMiddleware => {
		const sharedTreeConnection: SharedTreeConnection = { pixelEditorTreeView: undefined };
		return getDefaultMiddleware({
			thunk: {
				extraArgument: sharedTreeConnection
			}
		});
	}
});

// Get the type of our store variable as well as the RootState type that matches the store and an AppDispatch type that includes
// the thunk dispatcher signature.
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
