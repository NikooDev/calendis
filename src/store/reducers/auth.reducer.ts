import { createSlice } from '@reduxjs/toolkit';
import { type IAuthState, AuthEnum } from '@Calendis/types/auth';

const initialState: IAuthState = {
	isAuth: AuthEnum.LOGGED_LOADING
};

export const authSlice = createSlice({
	name: 'authReducer',
	initialState,
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