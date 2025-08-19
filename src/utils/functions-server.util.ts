import 'server-only';
import { adminAuth } from '@Calendis/services/firebase-admin.service';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Verifies the session of a user.
 * @param token
 */
export const verifyAuthSession = async (token?: string) => {
	if (!token) return null;

	try {
		return await adminAuth.verifySessionCookie(token, true);
	} catch {
		return null;
	}
}

/**
 * Checks if the user is authenticated.
 */
export const checkAuth = async () => {
	const authCookie = await cookies();
	const token = authCookie.get('user');

	if (!token || token && !token.value) {
		return redirect('/login');
	}

	const session = await verifyAuthSession(token.value);

	if (!session) {
		return redirect('/login');
	}
}