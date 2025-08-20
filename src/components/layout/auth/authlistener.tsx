'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AuthService from '@Calendis/services/auth.service';

const AuthListener = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const host = window.location.hostname.toLowerCase();
		const isAdminDomain = host === 'admin.calendis.fr';
		const isLocalLike =
			host === 'localhost' || host.startsWith('127.') || host === '::1' || host.endsWith('.vercel.app');

		const shouldRun = isAdminDomain || (isLocalLike && pathname.startsWith('/admin'));
		if (!shouldRun) return;

		AuthService.startAuthListener();

		return () => {
			AuthService.stopAuthListener();
		};
	}, [pathname]);

	return null;
};

export default AuthListener;