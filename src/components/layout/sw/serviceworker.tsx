'use client';

import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Update from '@Calendis/components/layout/sw/update';
import { FLAG, toastSuccessStyle } from '@Calendis/utils/constants.util';

const Serviceworker = () => {
	const lastShownUrlRef = useRef<string | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (sessionStorage.getItem(FLAG)) {
			sessionStorage.removeItem(FLAG);
			toast.success('Mise à jour installée.', { duration: 5000, style: toastSuccessStyle });
		}
	}, []);

	useEffect(() => {
		if (!('serviceWorker' in navigator)) return;

		const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';
		const controller = new AbortController();

		const showPrompt = (registration: ServiceWorkerRegistration) => {
			const waiting = registration.waiting;
			if (!waiting) return;

			const url = waiting.scriptURL;
			if (lastShownUrlRef.current === url) return;
			lastShownUrlRef.current = url;

			toast((t) => <Update waiting={waiting} toastId={t.id} />, {
				id: 'pwa-update',
				duration: Infinity,
			});
		};

		const wire = (registration: ServiceWorkerRegistration) => {
			if (registration.waiting) showPrompt(registration);

			registration.addEventListener('updatefound', () => {
				const worker = registration.installing;
				if (!worker) return;
				worker.addEventListener('statechange', () => {
					if (worker.state === 'installed' && registration.waiting) {
						showPrompt(registration);
					}
				});
			}, { signal: controller.signal });

			const check = () => {
				registration.update().catch(() => {});
			};

			const onVis = () => { if (document.visibilityState === 'visible') check(); };
			const onFocus = () => check();
			const onOnline = () => check();
			const interval = setInterval(check, 5 * 60 * 1000);

			document.addEventListener('visibilitychange', onVis, { signal: controller.signal } as any);
			window.addEventListener('focus', onFocus, { signal: controller.signal } as any);
			window.addEventListener('online', onOnline, { signal: controller.signal } as any);

			return () => clearInterval(interval);
		};

		let cleanupInterval: (() => void) | undefined;

		(async () => {
			try {
				const reg = await navigator.serviceWorker.register(`/sw.js?${encodeURIComponent(version)}`, {
					scope: '/',
					updateViaCache: 'none',
				});
				cleanupInterval = wire(reg);
			} catch {
				const reg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
				if (reg) cleanupInterval = wire(reg);
			}
		})();

		return () => {
			controller.abort();
			if (cleanupInterval) cleanupInterval();
		};
	}, []);

	return null;
}

export default Serviceworker;