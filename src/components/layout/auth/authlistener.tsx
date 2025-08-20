'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AuthService from '@Calendis/services/auth.service';

const AuthListener = () => {
	const pathname = usePathname();

	useEffect(() => {
		const host = window.location.hostname.toLowerCase();
		const isAdminDomain = host === 'admin.calendis.fr';
		const isLocalhost = host === 'localhost' || host.startsWith('127.') || host === '::1';
		const shouldRun = isAdminDomain || (isLocalhost && pathname.startsWith('/admin'));

		if (!shouldRun) return;

		AuthService.startAuthListener();

		return () => {
			AuthService.stopAuthListener();
		};
	}, [pathname]);

	return null;
};

export default AuthListener;