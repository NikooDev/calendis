import { createSlice } from '@reduxjs/toolkit';
import { AuthEnum } from '@Calendis/types/auth';

export const authSlice = createSlice({
	name: 'authReducer',
	initialState: {
		isAuth: AuthEnum.LOGGED_LOADING
	},
	reducers: {
		setLoginSuccess: state => {
			state.isAuth = AuthEnum.LOGGED_IN;
		},
		setLogout: state => {
			state.isAuth = AuthEnum.LOGGED_OUT;
		},
		setLoginError: state => {
			state.isAuth = AuthEnum.LOGGED_ERROR;
		}
	}
});

export const { setLoginSuccess, setLogout, setLoginError } = authSlice.actions;
export default authSlice.reducer;
