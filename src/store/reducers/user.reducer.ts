import { createSlice } from '@reduxjs/toolkit';
import { UserStateInterface } from '@Calendis/types/user';
import { getUser, setUser } from '@Calendis/actions/user.actions';
import { StateStatusEnum } from '@Calendis/types/store';

export const userSlice = createSlice({
	name: 'userReducer',
	initialState: {
		user: {},
		loading: false,
		status: StateStatusEnum.IDLE,
		error: null
	} as UserStateInterface,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getUser.pending, (state) => {
			state.loading = true;
			state.status = StateStatusEnum.LOADING;
			state.error = null;
		}).addCase(getUser.fulfilled, (state, action) => {
			state.loading = false;
			state.status = StateStatusEnum.SUCCESS;
			state.user = action.payload;
		}).addCase(getUser.rejected, (state, action) => {
			state.loading = false;
			state.status = StateStatusEnum.ERROR;
			state.error = action.payload as string;
		}).addCase(setUser.pending, (state) => {
			state.loading = true;
			state.status = StateStatusEnum.LOADING;
			state.error = null;
		}).addCase(setUser.fulfilled, (state, action) => {
			state.loading = false;
			state.status = StateStatusEnum.SUCCESS;

			if (action.payload && state.user) {
				const {
					uid = state.user.uid,
					firstname = state.user.firstname,
					lastname = state.user.lastname,
					email = state.user.email,
					avatarID = state.user.avatarID,
					badgeChat = state.user.badgeChat,
					created = state.user.created
				} = action.payload;

				state.user = {
					uid, firstname, lastname, email, avatarID, badgeChat, created
				};
			}
		}).addCase(setUser.rejected, (state, action) => {
			state.loading = false;
			state.status = StateStatusEnum.ERROR;
			state.error = action.payload as string;
		})
	}
});

export default userSlice.reducer;
