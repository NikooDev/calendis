export const runtime = 'nodejs';

import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@Calendis/services/firebase-admin.service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
	const c = await cookies();
	const session = c.get('user')?.value;

	const purge = (status = 401, body?: unknown) => {
		const { protocol, hostname } = req.nextUrl;
		const isHttps = protocol === 'https:';
		const domain = hostname.endsWith('calendis.fr') ? '.calendis.fr' : undefined;

		const res = NextResponse.json(body ?? { error: 'Unauthorized' }, { status });

		res.cookies.set('user', '', {
			path: '/',
			domain,
			httpOnly: true,
			sameSite: 'lax',
			secure: isHttps,
			maxAge: 0,
		});

		res.cookies.set('user', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isHttps,
			maxAge: 0,
		});

		return res;
	};

	if (!session) return purge(401, { error: 'No session' });

	try {
		const decoded = await adminAuth.verifySessionCookie(session, true);
		const token = await adminAuth.createCustomToken(decoded.uid);
		return NextResponse.json({ token });
	} catch {
		return purge(401, { error: 'Bad session' });
	}
}