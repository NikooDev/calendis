import FirebaseService from '@Calendis/services/firebase.service';
import { type Auth, type User, signOut, onIdTokenChanged, signInWithCustomToken } from '@firebase/auth';
import store from '@Calendis/store';
import { setLoginError, setLoginSuccess, setLogout } from '@Calendis/store/reducers/auth.reducer';
import { resetStore } from '@Calendis/store/reducers';
import { FirebaseError } from '@firebase/app';
import { idbHasAuthUserEntry } from '@Calendis/utils/functions-client.util';

class AuthService {
	private static listenerStarted = false;
	private static unsubscribeFn: (() => void) | null = null;
	private static loggingOut = false;
	private static bootstrapTried = false;
	private static bootstrapInFlight: Promise<void> | null = null;
	private static focusCheckInFlight: Promise<boolean> | null = null;
	private static lastFocusCheck = 0;
	private static readonly MIN_FOCUS_INTERVAL = 500;

	private static inAdminContext(): boolean {
		if (typeof window === 'undefined') return false;

		const host = window.location.hostname.toLowerCase();
		const path = window.location.pathname;

		const isAdminDomain = host === 'admin.calendis.fr';
		const isLocalLike =
			host === 'localhost' ||
			host.startsWith('127.') ||
			host === '::1' ||
			host.endsWith('.vercel.app');

		if (isAdminDomain) return true;

		return isLocalLike && path.startsWith('/admin');
	}

	private static get apiKey(): string {
		return FirebaseService.app?.options?.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
	}

	private static async bootstrapAuth(auth: Auth): Promise<void> {
		if (this.bootstrapInFlight) return this.bootstrapInFlight;
		this.bootstrapInFlight = (async () => {
			try {
				const r = await fetch('/api/auth/custom-token?ts=' + Date.now(), {
					method: 'POST',
					credentials: 'include',
					cache: 'no-store',
					headers: { 'Cache-Control': 'no-store' }
				});

				if (!r.ok) return;

				const { token } = await r.json();
				await signInWithCustomToken(auth, token);
			} catch {}
		})().finally(() => {
			this.bootstrapInFlight = null;
		});
		await this.bootstrapInFlight;
	}

	private static async checkOnFocus(auth: Auth) {
		const now = Date.now();
		if (now - this.lastFocusCheck < this.MIN_FOCUS_INTERVAL) return;

		if (this.focusCheckInFlight) {
			await this.focusCheckInFlight;
			return;
		}

		if (!navigator.onLine) return;

		this.focusCheckInFlight = (async () => {
			const serverOk = await this.checkAuth();
			if (!serverOk) { await this.hardLogout(auth); return false; }

			const hasLocalAuth = await idbHasAuthUserEntry(this.apiKey);
			if (!hasLocalAuth) { await this.hardLogout(auth); return false; }

			this.lastFocusCheck = Date.now();
			return true;
		})().finally(() => {
			this.focusCheckInFlight = null;
		});

		await this.focusCheckInFlight;
	}

	public static startAuthListener(): void {
		if (typeof window === 'undefined') return;
		if (!this.inAdminContext()) return;
		if (this.listenerStarted && this.unsubscribeFn) return;

		this.listenerStarted = true;

		let auth: Auth;

		try {
			auth = FirebaseService.auth;
		} catch (error) {
			console.error('[AuthService:startAuthListener] Firebase auth unavailable:', error);
			this.listenerStarted = false;
			return;
		}

		const Store = store();

		this.unsubscribeFn = onIdTokenChanged(
			auth,
			async (user: User | null) => {
				try {
					if (!user) {
						if (this.inAdminContext() && !this.bootstrapTried) {
							this.bootstrapTried = true;
							await this.bootstrapAuth(auth);
							return;
						}

						const ok = await this.checkAuth();
						if (!ok) await this.hardLogout(auth);
						return;
					}

					this.bootstrapTried = false;
					Store.dispatch(setLoginSuccess());
					//const profile = await getUserProfileFromFirestore(user.uid);
					//store.dispatch(setUserProfile({ uid: user.uid, email: user.email!, ...profile }));
				} catch (err) {
					console.error('[AuthService:startAuthListener] handler error:', err);
					Store.dispatch(setLoginError());
					Store.dispatch(resetStore());
				}
			}, (error) => {
				console.error('[AuthService:startAuthListener] onIdTokenChanged error:', error);
			}
		);

		const onFocus = () => { void this.checkOnFocus(auth); };
		window.addEventListener('focus', onFocus);

		const onVis = () => { if (document.visibilityState === 'visible') void this.checkOnFocus(auth); };
		document.addEventListener('visibilitychange', onVis);

		const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) void this.checkOnFocus(auth); };
		window.addEventListener('pageshow', onPageShow);

		const onOnline = () => { void this.checkOnFocus(auth); };
		window.addEventListener('online', onOnline);
	}

	private static async checkAuth(): Promise<boolean> {
		try {
			const res = await fetch(`/api/auth?ts=${Date.now()}`, {
				method: 'GET',
				credentials: 'include',
				cache: 'no-store',
				headers: {
					'Cache-Control': 'no-store',
					'Pragma': 'no-cache',
				}
			});

			return res.ok;
		} catch {
			return false;
		}
	}

	private static canonicalLoginURL(): string {
		if (typeof window === 'undefined') return '/login';

		const { protocol, hostname } = window.location;
		const isCalendis = hostname.toLowerCase().endsWith('calendis.fr');

		if (isCalendis) {
			return `${protocol}//www.calendis.fr/login`;
		}

		return '/login';
	}

	private static isOnCanonicalLogin(): boolean {
		if (typeof window === 'undefined') return false;
		const target = this.canonicalLoginURL();

		try {
			const a = new URL(target, window.location.href);
			const b = new URL(window.location.href);
			return a.hostname === b.hostname && a.pathname === b.pathname;
		} catch {
			return false;
		}
	}

	private static redirectToLogin(): void {
		if (typeof window === 'undefined') return;

		const target = this.canonicalLoginURL();

		if (!this.isOnCanonicalLogin()) {
			window.location.replace(target);
		}
	}

	public static async hardLogout(auth: Auth): Promise<void> {
		if (this.loggingOut) return;
		this.loggingOut = true;

		try {
			try {
				await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
			} catch {}
			try { await signOut(auth); } catch (error) {
				if ((error instanceof FirebaseError)) {
					console.warn('[AuthService:hardLogout] signOut failed:', error.code);
				} else {
					console.error('[AuthService:hardLogout] signOut error:', error);
				}
			}

			const Store = store();

			Store.dispatch(setLogout());
			Store.dispatch(resetStore());
		} finally {
			this.loggingOut = false;
		}

		this.redirectToLogin();
	}

	public static stopAuthListener(): void {
		this.unsubscribeFn?.();
		this.unsubscribeFn = null;
		this.listenerStarted = false;
	}
}

export default AuthService;