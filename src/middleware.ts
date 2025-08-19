import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global middleware that orchestrates cross-subdomain auth routing.
 *
 * Rules summary:
 * - On admin.calendis.fr: unauthenticated users are always redirected to https://calendis.fr/
 * - On admin.calendis.fr: authenticated users are normalized to /admin (no / or /login)
 * - On calendis.fr: when authenticated, /admin (or /, /login) should live on admin.calendis.fr
 * - On non-calendis hosts (localhost, previews): protect /admin → /login on same host
 */
const middleware = (req: NextRequest) => {
	const url = req.nextUrl;
	const pathname = url.pathname;

	const host = req.headers.get('host') ?? '';
	const hostname = host.split(':')[0];

	const hasSession = Boolean(req.cookies.get('user')?.value);

	const isCalendis = hostname.endsWith('calendis.fr');
	const isMainDomain = isCalendis && (hostname === 'calendis.fr' || hostname === 'www.calendis.fr');
	const isAdminDomain = isCalendis && hostname === 'admin.calendis.fr';

	const isAdminPath = pathname.startsWith('/admin');
	const isLoginPath = pathname === '/login';
	const isRootPath = pathname === '/';

	/**
	 * If the request targets admin.calendis.fr and the user has NO session cookie,
	 * force a top-level redirect to the public site root (https://calendis.fr/).
	 * This guarantees admin.* contains no public pages (even / or /login).
	 */
	if (isAdminDomain && !hasSession) {
		return NextResponse.redirect(new URL('https://www.calendis.fr/'));
	}

	/**
	 * If the request targets admin.calendis.fr and the user DOES have a session,
	 * normalize entry points (/ or /login) to /admin.
	 * All other admin paths are allowed to pass through.
	 */
	if (isAdminDomain && hasSession) {
		if (isRootPath || isLoginPath) {
			const dest = url.clone();
			dest.pathname = '/';
			dest.search = '';
			return NextResponse.redirect(dest);
		}
		return NextResponse.next();
	}


	/**
	 * On the main domain (calendis.fr), if the user is authenticated and requests /admin,
	 * redirect them to the admin subdomain, preserving the path and query string.
	 */
	if (isMainDomain && isAdminPath && hasSession) {
		return NextResponse.redirect(new URL(url.pathname + url.search, 'https://admin.calendis.fr'));
	}

	/**
	 * On the main domain (calendis.fr), if the user is authenticated and hits
	 * public entry points (/ or /login), send them to /admin on the admin subdomain.
	 */
	if (isMainDomain && hasSession && (isRootPath || isLoginPath)) {
		return NextResponse.redirect(new URL('/admin', 'https://admin.calendis.fr'));
	}

	/**
	 * Fallback for non-calendis hosts (localhost, preview deployments):
	 * protect any /admin path when NO session cookie is present
	 * by redirecting to /login on the SAME host.
	 */
	if (!isCalendis) {
		if (isAdminPath && !hasSession) {
			const dest = url.clone();
			dest.pathname = '/login';
			dest.search = '';
			return NextResponse.redirect(dest);
		}
		if (hasSession && (isRootPath || isLoginPath)) {
			const dest = url.clone();
			dest.pathname = '/admin';
			dest.search = '';
			return NextResponse.redirect(dest);
		}
	}

	return NextResponse.next();
}

export const config = { matcher: ['/', '/login', '/admin/:path*'] };

export default middleware;