import store from '@Calendis/store';

export type AppStoreType = ReturnType<typeof store>;
export type RootStateType = ReturnType<AppStoreType['getState']>;
export type AppDispatchType = AppStoreType['dispatch'];