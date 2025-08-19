'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AuthService from '@Calendis/services/auth.service';

const AuthListener = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (!pathname.startsWith('/admin')) return;
		AuthService.startAuthListener();

		return () => {
			AuthService.stopAuthListener();
		};
	}, [pathname]);

	return null;
};

export default AuthListener;