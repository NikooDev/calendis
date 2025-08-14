'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import store from '@Calendis/store';
import type { IChildren } from '@Calendis/types/app';
import type { AppStoreType } from '@Calendis/types/store';

const StoreProvider = ({ children }: IChildren) => {
	const storeRef = useRef<AppStoreType>(null);

	if (!storeRef.current) {
		storeRef.current = store();
	}

	return (
		<Provider store={storeRef.current}>
			{ children }
		</Provider>
	);
};

export default StoreProvider;