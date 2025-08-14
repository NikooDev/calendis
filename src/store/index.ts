import { configureStore } from '@reduxjs/toolkit';

const store = () => {
	return configureStore({
		reducer: {},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false
		})
	})
}

export default store;