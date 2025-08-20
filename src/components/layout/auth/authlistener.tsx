'use client';

import { useEffect } from 'react';
import AuthService from '@Calendis/services/auth.service';

const AuthListener = () => {
	useEffect(() => {
		AuthService.startAuthListener();

		return () => {
			AuthService.stopAuthListener();
		};
	}, []);

	return null;
};

export default AuthListener;