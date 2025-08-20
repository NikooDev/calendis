import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const JWKS_URL = 'https://identitytoolkit.googleapis.com/v1/sessionCookiePublicKeys';

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export type VerifyResult =
	| { ok: true; payload: Record<string, unknown> }
	| { ok: false; reason: string };

export async function verifyFirebaseSessionCookie(
	token: string,
	projectIdFromEnv?: string,
): Promise<VerifyResult> {
	try {
		if (!token || token.split('.').length !== 3) {
			return { ok: false, reason: 'shape' };
		}

		// On déduit le projectId depuis le payload si l'env n’est pas fourni
		const decoded = decodeJwt(token); // pas de vérif, lecture payload seulement
		const pidFromToken = typeof decoded.aud === 'string' ? decoded.aud : undefined;
		const projectId = projectIdFromEnv ?? pidFromToken;
		if (!projectId) return { ok: false, reason: 'aud-missing' };

		const iss = `https://session.firebase.google.com/${projectId}`;

		// Vérif RS256 + iss/aud + petite tolérance d’horloge
		const { payload } = await jwtVerify(token, JWKS, {
			algorithms: ['RS256'],
			issuer: iss,
			audience: projectId,
			clockTolerance: '60s',
		});

		// (optionnel) sanity: sub présent
		if (typeof payload.sub !== 'string' || !payload.sub) {
			return { ok: false, reason: 'sub' };
		}

		return { ok: true, payload };
	} catch (e: any) {
		// e.code peut être: ERR_JWT_EXPIRED, ERR_JWS_SIGNATURE_VERIFICATION_FAILED, etc.
		return { ok: false, reason: e?.code || 'verify-failed' };
	}
}

function buildPathCandidates(currentPath: string): string[] {
	// '/admin/a/b' -> ['/admin/a/b','/admin/a','/admin','/']
	const parts = currentPath.split('/').filter(Boolean);
	const paths: string[] = ['/'];
	let acc = '';
	for (const p of parts) {
		acc += `/${p}`;
		paths.push(acc);
	}
	// unique + longest-first (not mandatory, but nice)
	return Array.from(new Set(paths)).sort((a, b) => b.length - a.length);
}

export function purgeSessionCookie(
	res: NextResponse,
	isHttps: boolean,
	hostname: string,
	currentPath: string = '/',
) {
	const candidates = buildPathCandidates(currentPath);

	// Shared cookie for prod subdomains
	if (hostname.endsWith('calendis.fr')) {
		for (const path of candidates) {
			res.cookies.set('user', '', {
				path,
				domain: '.calendis.fr',
				httpOnly: true,
				sameSite: 'lax',
				secure: isHttps,
				maxAge: 0, // expire now
			});
		}
	}

	// Host-only variant (in case it was set without domain)
	for (const path of candidates) {
		res.cookies.set('user', '', {
			path,
			httpOnly: true,
			sameSite: 'lax',
			secure: isHttps,
			maxAge: 0,
		});
	}
}