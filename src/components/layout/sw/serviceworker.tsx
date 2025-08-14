'use client';

import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Update from '@Calendis/components/layout/sw/update';
import { FLAG, toastSuccessStyle } from '@Calendis/utils/constants.util';

const Serviceworker = () => {
	const shown = useRef(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (sessionStorage.getItem(FLAG)) {
			sessionStorage.removeItem(FLAG);
			toast.success('Mise à jour installée.', { style: toastSuccessStyle, duration: 5000 });
		}
	}, []);

	useEffect(() => {
		if (!('serviceWorker' in navigator)) return;

		let reg: ServiceWorkerRegistration | undefined;

		const showPrompt = (r: ServiceWorkerRegistration) => {
			if (shown.current || !r.waiting) return;
			shown.current = true;
			toast((t) => <Update reg={r} toastId={t.id} />, {
				id: 'pwa-update',
				duration: Infinity,
			});
		};

		const check = () => reg?.update().catch(() => {});

		const setup = async () => {
			const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';
			try {
				reg = await navigator.serviceWorker.register(`/static/sw/sw.js?${encodeURIComponent(version)}`, {
					scope: '/static/sw/',
					updateViaCache: 'none',
				});
			} catch {
				reg =
					(await navigator.serviceWorker.getRegistration()) ??
					(await navigator.serviceWorker.ready.catch(() => undefined));
			}
			if (!reg) return;

			check();

			if (reg.waiting) showPrompt(reg);

			reg.addEventListener('updatefound', () => {
				const sw = reg!.installing;
				if (!sw) return;
				sw.addEventListener('statechange', () => {
					if (sw.state === 'installed' && navigator.serviceWorker.controller) {
						showPrompt(reg!);
					}
				});
			});

			const onVis = () => document.visibilityState === 'visible' && check();
			const onFocus = () => check();
			const onOnline = () => check();
			const interval = setInterval(check, 5 * 60 * 1000);

			document.addEventListener('visibilitychange', onVis);
			window.addEventListener('focus', onFocus);
			window.addEventListener('online', onOnline);

			return () => {
				document.removeEventListener('visibilitychange', onVis);
				window.removeEventListener('focus', onFocus);
				window.removeEventListener('online', onOnline);
				clearInterval(interval);
			};
		};

		let cleanup: (() => void) | void;
		setup().then((c) => (cleanup = c));

		return () => {
			if (cleanup) cleanup();
		};
	}, []);

	return null;
}

export default Serviceworker;