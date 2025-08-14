import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const middleware = (req: NextRequest) => {
	const host = req.headers.get('host')?.toLowerCase() ?? '';
	const url = req.nextUrl;
	const accept = req.headers.get('accept') || '';
	const isDocOrRSC =
		req.headers.get('sec-fetch-dest') === 'document' ||
		accept.includes('text/html') ||
		accept.includes('text/x-component');

	if (host === 'www.calendis.fr' && (isDocOrRSC) && url.pathname.startsWith('/admin')) {
		url.hostname = 'admin.calendis.fr';
		return NextResponse.redirect(url, 308);
	}

	const isAdminHost = host === 'admin.calendis.fr';
	const isDevAdmin = host.startsWith('localhost') && url.pathname.startsWith('/admin');

	if ((isAdminHost || isDevAdmin) && isDocOrRSC) {
		if (isAdminHost) {
			if (url.pathname === '/' || url.pathname === '') {
				url.pathname = '/admin';
				return NextResponse.rewrite(url);
			}
			if (!url.pathname.startsWith('/admin')) {
				url.pathname = `/admin${url.pathname}`;
				return NextResponse.rewrite(url);
			}
		}
	}

	return NextResponse.next();
}

export const config = { matcher: ['/:path*'] };

export default middleware;