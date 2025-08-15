'use client';

import { useCallback, useEffect, useState } from 'react';

const BUILD_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';

const Version = () => {
	const [version, setVersion] = useState<string>(BUILD_VERSION);

	const requestSwVersion = useCallback(async (): Promise<string> => {
		if (!('serviceWorker' in navigator)) return BUILD_VERSION;

		if (navigator.serviceWorker.controller) {
			try {
				const channel = new MessageChannel();

				const reply = new Promise<string | null>((resolve) => {
					const timer = setTimeout(() => {
						try { channel.port1.close(); } catch {}
						resolve(null);
					}, 1500);

					channel.port1.onmessage = (e) => {
						clearTimeout(timer);
						try { channel.port1.close(); } catch {}
						const v = e.data?.version ?? null;
						resolve(typeof v === 'string' && v ? v : null);
					};
				});

				navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
				const v = await reply;
				if (v) return v;
			} catch {}
		}

		try {
			const reg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
			const fromActive = extractVersionFromScriptURL(reg?.active?.scriptURL);
			if (fromActive) return fromActive;
		} catch {}

		return BUILD_VERSION;
	}, []);

	useEffect(() => {
		let cancelled = false;

		void requestSwVersion().then((v) => {
			if (!cancelled && v) setVersion(v);
		});

		const onCtrl = () => {
			void requestSwVersion().then((v) => {
				if (!cancelled && v) setVersion(v);
			});
		};

		navigator.serviceWorker?.addEventListener('controllerchange', onCtrl, { once: true });

		return () => {
			cancelled = true;
			navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl as any);
		};
	}, [requestSwVersion]);

	return version ? version : '0.0.0';
};

export default Version;