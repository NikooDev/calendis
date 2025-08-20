import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { purgeSessionCookie, verifyFirebaseSessionCookie } from '@Calendis/utils/functions-edge.util';

export const middleware = async (req: NextRequest) => {
	const url = req.nextUrl;
	const { pathname, protocol } = url;

	const hostHeader = req.headers.get('host') ?? '';
	const hostname   = hostHeader.split(':')[0];

	const isHttps       = protocol === 'https:';
	const isCalendis    = hostname.endsWith('calendis.fr');
	const isMainDomain  = isCalendis && (hostname === 'calendis.fr' || hostname === 'www.calendis.fr');
	const isAdminDomain = isCalendis && hostname === 'admin.calendis.fr';

	const isAdminPath = pathname.startsWith('/admin');
	const isLoginPath = pathname === '/login';
	const isRootPath  = pathname === '/';

	const redirectSafe = (to: URL) =>
		to.href === req.url ? NextResponse.next() : NextResponse.redirect(to);

	const publicLogin = new URL('https://www.calendis.fr/login');

	const raw = req.cookies.get('user')?.value;
	const envPid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
	const vr = raw ? await verifyFirebaseSessionCookie(raw, envPid) : { ok: false, reason: 'missing' as const };
	const looksValid = vr.ok;

	/**
	 * admin.calendis.fr
	 */

	if (isAdminDomain && !looksValid) {
		const res = NextResponse.redirect(publicLogin);
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	if (isAdminDomain && looksValid && isLoginPath) {
		const dest = url.clone();
		dest.pathname = '/';
		dest.search = '';
		return redirectSafe(dest);
	}

	if (isAdminDomain && looksValid) {
		const rewritePath = `/admin${isRootPath ? '' : pathname}`;
		return NextResponse.rewrite(new URL(rewritePath + url.search, req.url));
	}

	/**
	 * calendis.fr
	 */

	if (isMainDomain && !raw && !looksValid && isAdminPath) {
		return NextResponse.redirect(publicLogin);
	}

	if (isMainDomain && raw && !looksValid) {
		const res = isAdminPath ? NextResponse.redirect(publicLogin) : NextResponse.next();
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	if (isMainDomain && looksValid && isAdminPath) {
		const rest = pathname.slice('/admin'.length) || '/';
		return redirectSafe(new URL(rest + url.search, 'https://admin.calendis.fr'));
	}

	if (isMainDomain && looksValid && (isRootPath || isLoginPath)) {
		return redirectSafe(new URL('/', 'https://admin.calendis.fr'));
	}

	/**
	 * localhost
	 */

	if (!isCalendis && isAdminPath && !looksValid) {
		const dest = url.clone();
		dest.pathname = '/login';
		dest.search = '';
		return redirectSafe(dest);
	}

	if (!isCalendis && looksValid && (isRootPath || isLoginPath)) {
		const dest = url.clone();
		dest.pathname = '/admin';
		dest.search = '';
		return redirectSafe(dest);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml|webmanifest)).*)',
	],
};

export default middleware;