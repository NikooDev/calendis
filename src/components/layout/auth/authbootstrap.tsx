'use client';

import { useEffect } from 'react';
import FirebaseService from '@Calendis/services/firebase.service';
import { signInWithCustomToken } from '@firebase/auth';

const AuthBootstrap = () => {
	useEffect(() => {
		(async () => {
			const auth = FirebaseService.auth;
			if (auth.currentUser) return;

			const r = await fetch('/api/auth/custom-token', { method: 'POST', credentials: 'include' });
			if (!r.ok) return;

			const { token } = await r.json();
			await signInWithCustomToken(auth, token);
		})();
	}, []);
	return null;
};

export default AuthBootstrap;