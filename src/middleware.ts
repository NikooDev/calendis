import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const middleware = (req: NextRequest) => {
	const url = req.nextUrl;
	const pathname = url.pathname;

	const host = req.headers.get('host') ?? '';
	const hostname = host.split(':')[0];

	const isAdminPath = pathname.startsWith('/admin');
	const isGuestPath = pathname === '/login' || pathname === '/';
	const hasSession = Boolean(req.cookies.get('user')?.value);

	const isCalendis = hostname.endsWith('calendis.fr');
	const isMainDomain = isCalendis && (hostname === 'calendis.fr' || hostname === 'www.calendis.fr');
	const isAdminDomain = isCalendis && hostname === 'admin.calendis.fr';

	if (isAdminPath && !hasSession) {
		const dest = url.clone();
		if (isAdminDomain) {
			dest.hostname = 'calendis.fr';
			dest.protocol = 'https:';
		}
		dest.pathname = '/login';
		dest.search = '';
		return NextResponse.redirect(dest);
	}

	if (isAdminPath && isMainDomain && hasSession) {
		const dest = new URL(url.pathname + url.search, 'https://admin.calendis.fr');
		return NextResponse.redirect(dest);
	}

	if (isGuestPath && hasSession) {
		const dest = url.clone();
		if (isCalendis) {
			dest.hostname = 'admin.calendis.fr';
			dest.protocol = 'https:';
		}
		dest.pathname = '/admin';
		dest.search = '';
		return NextResponse.redirect(dest);
	}

	return NextResponse.next();
}

export const config = { matcher: ['/login', '/admin/:path*'] };

export default middleware;