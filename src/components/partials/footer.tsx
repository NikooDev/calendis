'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { BackIcon, LockIcon } from '@Calendis/components/ui/icons';
import Link from 'next/link';

const Footer = () => {
	const [version, setVersion] = useState<string | null>(null);

	const pathname = usePathname();
	const isHome = pathname === '/';
	const isLogin = pathname === '/login';

	const handleVersion = useCallback( async () => {
		if (!('serviceWorker' in navigator)) return;
		const ctrl = navigator.serviceWorker.controller;
		if (!ctrl) {
			setVersion(process.env.NEXT_PUBLIC_APP_VERSION ?? null);
			return;
		}

		const channel = new MessageChannel();
		channel.port1.onmessage = (e) => setVersion(e.data?.version ?? null);
		ctrl.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
	}, [])

	useEffect(() => {
		void handleVersion()
	}, [handleVersion]);

	const getYear = () => {
		return new Date().getFullYear();
	}

	return (
		<footer className="absolute z-40 bottom-0 left-0 right-0 overflow-hidden w-full">
			<div className="flex items-center justify-between text-sm">
				<div className="h-10">
					<Link
						href="/"
						className={twMerge(
							"absolute inset-y-0 left-0 inline-flex items-center font-bold text-white pl-3 pr-4 rounded-tr-2xl transition-all duration-300 will-change-transform",
							"bg-pink-700 hover:bg-pink-600",
							isLogin ? "translate-y-0 pointer-events-auto" : "opacity-0 invisible translate-y-[30px] pointer-events-none"
						)}
					>
						<BackIcon className="mr-2"/>
						<span className="mt-0.5">Retour</span>
					</Link>
					<Link
						href="/login"
						className={twMerge(
							"absolute inset-y-0 left-0 inline-flex items-center font-bold text-white pl-3 pr-4 rounded-tr-2xl transition-all duration-300 will-change-transform",
							"bg-pink-700 hover:bg-pink-600",
							isHome ? "translate-y-0 pointer-events-auto" : "opacity-0 invisible translate-y-[30px] pointer-events-none"
						)}
					>
						<LockIcon className="mr-2"/>
						<span className="mt-0.5">Connexion</span>
					</Link>
				</div>
				<div className={twMerge('flex items-center ml-auto pr-4', (!isHome && !isLogin) && 'pb-2.5')}>
					<p className="font-semibold text-white">Calendis © { getYear() }</p>
					<p className="mx-1 text-white">•</p>
					<p className="font-semibold text-white">Version { version ? version : '0.0.0' }</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;