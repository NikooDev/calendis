'use client';

import { useEffect } from 'react';
import FirebaseService from '@Calendis/services/firebase.service';
import { signInWithCustomToken } from '@firebase/auth';

const AuthBootstrap = () => {
	useEffect(() => {
		(async () => {
			const auth = FirebaseService.auth;
			if (auth.currentUser) return;

			const r = await fetch('/api/auth/custom-token', {
				method: 'POST',
				credentials: 'include',
			});

			if (!r.ok) {
				try { await fetch('/api/auth', { method: 'DELETE', credentials: 'include' }); } catch {}

				try { await signInWithCustomToken(FirebaseService.auth, ''); } catch {}
				try { await import('firebase/auth').then(m => m.signOut(auth)); } catch {}

				const { protocol, hostname } = window.location;
				const to = hostname.endsWith('calendis.fr')
					? `${protocol}//www.calendis.fr/login`
					: '/login';
				window.location.replace(to);
				return;
			}

			const { token } = await r.json();
			await signInWithCustomToken(auth, token);
		})();
	}, []);
	return null;
};

export default AuthBootstrap;