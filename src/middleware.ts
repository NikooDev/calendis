import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseJwt, purgeSessionCookie, verifyFirebaseSessionJWT } from '@Calendis/utils/functions-edge.util';

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
	const vr = raw ? await verifyFirebaseSessionJWT(raw, envPid) : { ok: false, reason: 'missing' as const };
	const looksValid = vr.ok;

	const DEBUG_EDGE = process.env.NEXT_PUBLIC_DEBUG_EDGE === '1';

	function addDebug(res: NextResponse, host: string, path: string, vr: { ok: boolean; reason?: string }, raw?: string) {
		if (!DEBUG_EDGE) return;
		res.headers.set('x-auth-edge', vr.ok ? 'ok' : `bad:${vr.reason ?? 'unknown'}`);
		res.headers.set('x-auth-host', host);
		res.headers.set('x-auth-path', path);
		if (raw) {
			const parsed = parseJwt(raw);
			if (parsed?.header?.kid) res.headers.set('x-auth-kid', String(parsed.header.kid).slice(0, 8));
			if (parsed?.payload?.aud) res.headers.set('x-auth-aud', String(parsed.payload.aud));
			if (parsed?.payload?.iss) res.headers.set('x-auth-iss', String(parsed.payload.iss));
			if (parsed?.payload?.exp) res.headers.set('x-auth-exp', String(parsed.payload.exp));
		}
	}

	/* ===================== PRODUCTION: admin.calendis.fr ===================== */

	// Invité sur admin.* → login public (+ purge)
	if (isAdminDomain && !looksValid) {
		const res = NextResponse.redirect(publicLogin);
		addDebug(res, hostname, pathname, vr, raw);
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	// Authentifié sur admin.* + /login → /
	if (isAdminDomain && looksValid && isLoginPath) {
		const dest = url.clone();
		dest.pathname = '/';
		dest.search = '';
		const res = redirectSafe(dest);
		addDebug(res, hostname, pathname, vr, raw);
		return res;
	}

	// Authentifié sur admin.* → rewrite de "/" -> "/admin" et "/x" -> "/admin/x"
	if (isAdminDomain && looksValid) {
		const rewritePath = `/admin${isRootPath ? '' : pathname}`;
		const res = NextResponse.rewrite(new URL(rewritePath + url.search, req.url));
		addDebug(res, hostname, pathname, vr, raw);
		return res;
	}

	/* ===================== PRODUCTION: calendis.fr / www.calendis.fr ===================== */

	// Pas de cookie + invité qui cible /admin* → login public
	if (isMainDomain && !raw && !looksValid && isAdminPath) {
		const res = NextResponse.redirect(publicLogin);
		addDebug(res, hostname, pathname, vr, raw); // vr.reason devrait être "missing"
		return res;
	}

	// Cookie présent mais invalide (bidon/expiré). On purge et on applique la règle invité
	if (isMainDomain && raw && !looksValid) {
		const res = isAdminPath ? NextResponse.redirect(publicLogin) : NextResponse.next();
		addDebug(res, hostname, pathname, vr, raw);
		purgeSessionCookie(res, isHttps, hostname, pathname);
		return res;
	}

	// Authentifié sur le domaine principal et demande /admin* → bascule vers admin.calendis.fr (on retire /admin)
	if (isMainDomain && looksValid && isAdminPath) {
		const rest = pathname.slice('/admin'.length) || '/';
		const res = redirectSafe(new URL(rest + url.search, 'https://admin.calendis.fr'));
		addDebug(res, hostname, pathname, vr, raw);
		return res;
	}

	// Authentifié sur le domaine principal et demande / ou /login → racine admin.calendis.fr
	if (isMainDomain && looksValid && (isRootPath || isLoginPath)) {
		const res = redirectSafe(new URL('/', 'https://admin.calendis.fr'));
		addDebug(res, hostname, pathname, vr, raw);
		return res;
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