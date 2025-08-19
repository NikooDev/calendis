export const runtime = 'nodejs';

import 'server-only';
import { NextRequest } from 'next/server';
import { adminAuth } from '@Calendis/services/firebase-admin.service';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;

const COOKIE_NAME = 'user';
const COOKIE_EXPIRE = 14 * DAY;

/**
 * Creates a session for a user.
 * @param req
 * @constructor
 */
export const POST = async (req: NextRequest) => {
	const { token: idToken } = await req.json();

	if (!idToken) {
		return new Response('Missing token', { status: 400 });
	}

	const sessionCookie = await adminAuth.createSessionCookie(idToken, {
		expiresIn: COOKIE_EXPIRE
	});

	const { hostname, protocol } = req.nextUrl;
	const isHttps = protocol === 'https:';
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

	const cookieDomain = hostname.endsWith('calendis.fr') ? '.calendis.fr' : undefined;
	const cookieSecure = isHttps && !isLocalhost;

	const authCookie = await cookies();

	authCookie.set(COOKIE_NAME, sessionCookie, {
		httpOnly: true,
		secure: cookieSecure,
		sameSite: 'lax',
		path: '/',
		domain: cookieDomain,
		maxAge: COOKIE_EXPIRE / 1000
	});

	return new Response(null, { status: 204 });
}

/**
 * Verifies the session of a user.
 * @constructor
 */
export const GET = async () => {
	const authCookie = await cookies();
	const sessionCookie = authCookie.get(COOKIE_NAME)?.value;

	if (!sessionCookie) {

		return new Response(null, { status: 401 });
	}

	try {
		const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

		return Response.json(decoded);
	} catch {
		authCookie.delete(COOKIE_NAME);
		return new Response(null, { status: 401 });
	}
}

/**
 * Deletes the session of a user.
 * @constructor
 */
export const DELETE = async () => {
	const authCookie = await cookies();
	const sessionCookie = authCookie.get(COOKIE_NAME)?.value;

	if (sessionCookie) {
		try {
			const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

			await getAuth().revokeRefreshTokens(decoded.sub);
		} catch {}
	}

	authCookie.delete(COOKIE_NAME);
	return new Response(null, { status: 204 });
}