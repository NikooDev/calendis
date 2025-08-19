import 'server-only';
import { adminAuth } from '@Calendis/services/firebase-admin.service';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

/**
 * Checks if the user is authenticated.
 */
export const checkAuth = async () => {
	const authCookie = await cookies();
	const session = authCookie.get('user')?.value;

	const host = (await headers()).get('host') ?? '';
	const isAdminHost = host === 'admin.calendis.fr';

	const loginURL = isAdminHost ? 'https://www.calendis.fr/login' : '/login';

	if (!session) return redirect(loginURL);

	try {
		await adminAuth.verifySessionCookie(session, true);
		return;
	} catch {
		return redirect(loginURL);
	}
}