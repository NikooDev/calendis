import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { purgeSessionCookie, verifyFirebaseSessionCookie } from '@Calendis/utils/functions-edge.util';

/**
 * Global middleware that orchestrates cross-subdomain auth routing.
 *
 * Rules summary:
 * - On admin.calendis.fr: unauthenticated users are always redirected to https://calendis.fr/
 * - On admin.calendis.fr: authenticated users are normalized to /admin (no / or /login)
 * - On calendis.fr: when authenticated, /admin (or /, /login) should live on admin.calendis.fr
 * - On non-calendis hosts (localhost, previews): protect /admin → /login on same host
 */
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

	/* ===================== PRODUCTION: admin.calendis.fr ===================== */

	// Invité sur admin.* → login public (+ purge)
	if (isAdminDomain && !looksValid) {
		const res = NextResponse.redirect(publicLogin);
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	// Authentifié sur admin.* + /login → /
	if (isAdminDomain && looksValid && isLoginPath) {
		const dest = url.clone();
		dest.pathname = '/';
		dest.search = '';
		return redirectSafe(dest);
	}

	// Authentifié sur admin.* → rewrite de "/" -> "/admin" et "/x" -> "/admin/x"
	if (isAdminDomain && looksValid) {
		const rewritePath = `/admin${isRootPath ? '' : pathname}`;
		return NextResponse.rewrite(new URL(rewritePath + url.search, req.url));
	}

	/* ===================== PRODUCTION: calendis.fr / www.calendis.fr ===================== */

	// Pas de cookie + invité qui cible /admin* → login public
	if (isMainDomain && !raw && !looksValid && isAdminPath) {
		return NextResponse.redirect(publicLogin);
	}

	// Cookie présent mais invalide (bidon/expiré). On purge et on applique la règle invité
	if (isMainDomain && raw && !looksValid) {
		const res = isAdminPath ? NextResponse.redirect(publicLogin) : NextResponse.next();
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	// Authentifié sur le domaine principal et demande /admin* → bascule vers admin.calendis.fr (on retire /admin)
	if (isMainDomain && looksValid && isAdminPath) {
		const rest = pathname.slice('/admin'.length) || '/';
		return redirectSafe(new URL(rest + url.search, 'https://admin.calendis.fr'));
	}

	// Authentifié sur le domaine principal et demande / ou /login → racine admin.calendis.fr
	if (isMainDomain && looksValid && (isRootPath || isLoginPath)) {
		return redirectSafe(new URL('/', 'https://admin.calendis.fr'));
	}

	/* ===================== LOCALHOST / PREVIEW (pas *.calendis.fr) ===================== */

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
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)).*)',
	],
};

export default middleware;