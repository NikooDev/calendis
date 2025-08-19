import { cookies } from 'next/headers';
import { adminAuth } from '@Calendis/services/firebase-admin.service';

export const POST = async () => {
	const c = await cookies();
	const session = c.get('user')?.value;

	if (!session) return new Response(null, { status: 401 });

	try {
		const decoded = await adminAuth.verifySessionCookie(session, true);
		const token = await adminAuth.createCustomToken(decoded.uid);

		return Response.json({ token });
	} catch {
		return new Response(null, { status: 401 });
	}
}