'use client';

import { useEffect } from 'react';
import FirebaseService from '@Calendis/services/firebase.service';
import { signInWithCustomToken } from '@firebase/auth';
import AuthService from '@Calendis/services/auth.service';

const AuthBootstrap = () => {
	useEffect(() => {
		let cancelled = false;

		(async () => {
			const auth = FirebaseService.auth;

			if (auth.currentUser) {
				try {
					const ping = await fetch('/api/auth', { method: 'GET', credentials: 'include', cache: 'no-store' });
					if (!ping.ok && !cancelled) await AuthService.hardLogout(auth);
				} catch {
					if (!cancelled) await AuthService.hardLogout(auth);
				}
				return;
			}

			try {
				const r = await fetch('/api/auth/custom-token', { method: 'POST', credentials: 'include' });

				if (!r.ok) {
					if (!cancelled) await AuthService.hardLogout(auth);
					return;
				}

				const { token } = await r.json();
				if (cancelled) return;

				await signInWithCustomToken(auth, token);
			} catch {
				if (!cancelled) await AuthService.hardLogout(auth);
			}
		})();

		return () => { cancelled = true; };
	}, []);

	return null;
};

export default AuthBootstrap;