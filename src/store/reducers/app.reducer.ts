import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type IAppState, NetworkEnum } from '@Calendis/types/app';

const initialState: IAppState = {
	online: typeof window !== 'undefined' && navigator.onLine
		? NetworkEnum.ONLINE
		: NetworkEnum.OFFLINE
};

export const appSlice = createSlice({
	name: 'appReducer',
	initialState,
	reducers: {
		setNetwork: (state, action: PayloadAction<NetworkEnum>) => {
			state.online = action.payload;
		}
	}
});

export const { setNetwork } = appSlice.actions;
export default appSlice.reducer;