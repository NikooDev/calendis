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

	const redirectSafe = (to: URL) => (to.href === req.url ? NextResponse.next() : NextResponse.redirect(to));

	if (isAdminDomain && !hasSession) {
		return NextResponse.redirect(new URL('https://www.calendis.fr/login'));
	}

	if (isAdminDomain && hasSession) {
		if (isLoginPath) {
			const dest = url.clone();
			dest.pathname = '/';
			dest.search = '';
			return redirectSafe(dest);
		}
		const rewritePath = `/admin${isRootPath ? '' : pathname}`;
		return NextResponse.rewrite(new URL(rewritePath + url.search, req.url));
	}

	if (isMainDomain && isAdminPath && hasSession) {
		const rest = pathname.slice('/admin'.length) || '/';
		return redirectSafe(new URL(rest + url.search, 'https://admin.calendis.fr'));
	}

	if (isMainDomain && hasSession && (isRootPath || isLoginPath)) {
		return redirectSafe(new URL('/', 'https://admin.calendis.fr'));
	}

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