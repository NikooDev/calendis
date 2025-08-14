import { combineReducers, Reducer } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import appReducer from '@Calendis/store/reducers/app.reducer';
import authReducer from '@Calendis/store/reducers/auth.reducer';

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const resetStore = createAction('root/resetStore');

export const reducers: Reducer<RootState> = (state, action) => {
	if (resetStore.match(action)) {
		state = undefined;
	}

	return rootReducer(state, action);
};
