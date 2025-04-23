import { configureStore } from '@reduxjs/toolkit';
import { reducers } from '@Calendis/store/reducers';

const store = configureStore({
	reducer: reducers,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		immutableCheck: false,
		serializableCheck: false
	})
});

export default store;
