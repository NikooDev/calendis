import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { purgeSessionCookie, verifyFirebaseSessionJWT } from '@Calendis/utils/functions-edge.util';

/**
 * Global middleware that orchestrates cross-subdomain auth routing.
 *
 * Rules summary:
 * - On admin.calendis.fr: unauthenticated users are always redirected to https://calendis.fr/
 * - On admin.calendis.fr: authenticated users are normalized to /admin (no / or /login)
 * - On calendis.fr: when authenticated, /admin (or /, /login) should live on admin.calendis.fr
 * - On non-calendis hosts (localhost, previews): protect /admin → /login on same host
 */
const middleware = async (req: NextRequest) => {
	const url = req.nextUrl;
	const { pathname, protocol } = url;

	const host = req.headers.get('host') ?? '';
	const hostname = host.split(':')[0];

	const hasSession = Boolean(req.cookies.get('user')?.value);

	const isCalendis = hostname.endsWith('calendis.fr');
	const isMainDomain = isCalendis && (hostname === 'calendis.fr' || hostname === 'www.calendis.fr');
	const isAdminDomain = isCalendis && hostname === 'admin.calendis.fr';

	const isAdminPath = pathname.startsWith('/admin');
	const isLoginPath = pathname === '/login';
	const isRootPath = pathname === '/';
	const isHttps = protocol === 'https:';

	const redirectSafe = (to: URL) => (to.href === req.url ? NextResponse.next() : NextResponse.redirect(to));

	const raw = req.cookies.get('user')?.value;
	const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
	const looksValid =
		!!(projectId && raw) &&
		(await verifyFirebaseSessionJWT(raw!, projectId!)).ok;

	if (isAdminDomain && !looksValid) {
		const res = NextResponse.redirect(new URL('https://www.calendis.fr/login'));
		purgeSessionCookie(res, isHttps, hostname);
		return res;
	}

	if (isAdminDomain && looksValid) {
		if (isLoginPath) {
			const dest = url.clone();
			dest.pathname = '/';
			dest.search = '';
			return redirectSafe(dest);
		}
		const rewritePath = `/admin${isRootPath ? '' : pathname}`;
		return NextResponse.rewrite(new URL(rewritePath + url.search, req.url));
	}

	if (isMainDomain && looksValid) {
		if (isAdminPath) {
			const rest = pathname.slice('/admin'.length) || '/';
			return redirectSafe(new URL(rest + url.search, 'https://admin.calendis.fr'));
		}
		if (isRootPath || isLoginPath) {
			return redirectSafe(new URL('/', 'https://admin.calendis.fr'));
		}
	}

	if (!isCalendis && isAdminPath && !looksValid) {
		const dest = url.clone();
		dest.pathname = '/login';
		dest.search = '';
		return redirectSafe(dest);
	}

	return NextResponse.next();
}

export const config = { matcher: ['/', '/login', '/admin/:path*'] };

export default middleware;