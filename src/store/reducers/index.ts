import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';
import appReducer from '@Calendis/store/reducers/app.reducer';
import authReducer from '@Calendis/store/reducers/auth.reducer';
import userReducer from '@Calendis/store/reducers/user.reducer';

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	user: userReducer
});

const rootSlice = createSlice({
	name: 'root',
	initialState: {},
	reducers: {
		resetStore: () => {
			return {};
		}
	}
});

export const reducers = (state: ReturnType<typeof rootReducer> | undefined, action: PayloadAction) => {
	return rootReducer(state, action);
};

export const { resetStore } = rootSlice.actions;
