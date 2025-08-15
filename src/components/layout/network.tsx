'use client';

import { useEffect, useRef } from 'react';
import { useNetworkState } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@Calendis/store/reducers';
import { NetworkEnum } from '@Calendis/types/app';
import { setNetwork } from '@Calendis/store/reducers/app.reducer';
import { toastErrorStyle, toastSuccessStyle } from '@Calendis/utils/constants.util';
import toast from 'react-hot-toast';

const OFFLINE_FLAG = 'net:wasOffline';

const NetworkStatus = () => {
	const { online } = useNetworkState();
	const isOnline = online ?? (typeof navigator !== 'undefined' ? navigator.onLine : true);
	const currentNetwork = useSelector((s: RootState) => s.app.online);
	const dispatch = useDispatch();
	const prevOnline = useRef<boolean | null>(null);

	useEffect(() => {
		const nextNetwork = isOnline ? NetworkEnum.ONLINE : NetworkEnum.OFFLINE;
		if (currentNetwork !== nextNetwork) dispatch(setNetwork(nextNetwork));

		if (prevOnline.current === null) {
			if (!isOnline) {
				sessionStorage.setItem(OFFLINE_FLAG, '1');
				toast.error('Vous êtes actuellement hors ligne.', {id: 'network-offline', duration: Infinity, style: toastErrorStyle});
			} else {
				if (sessionStorage.getItem(OFFLINE_FLAG)) {
					sessionStorage.removeItem(OFFLINE_FLAG);
					toast.dismiss('network-offline');
					toast.success('Votre connexion internet a été restaurée.', {id: 'network-online', duration: 4000, style: toastSuccessStyle });
				}
			}

		} else {
			if (!prevOnline.current && isOnline) {
				sessionStorage.removeItem(OFFLINE_FLAG);
				toast.dismiss('network-offline');
				toast.success('Votre connexion internet a été restaurée.', {id: 'network-online', duration: 4000, style: toastSuccessStyle});
			} else if (prevOnline.current && !isOnline) {
				sessionStorage.setItem(OFFLINE_FLAG, '1');
				toast.dismiss('network-online');
				toast.error('Vous êtes actuellement hors ligne.', {id: 'network-offline', duration: Infinity, style: toastErrorStyle});
			}
		}

		prevOnline.current = isOnline;
	}, [isOnline, currentNetwork, dispatch]);

	return null;
};

export default NetworkStatus;