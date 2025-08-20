import type { NextResponse } from 'next/server';

/** ---------- base64url + JWT helpers (Edge-safe) ---------- */

export function b64uToBytes(b64u: string): Uint8Array {
	// Edge (middleware) expose atob / TextDecoder. Aucune dépendance Node.
	const pad = '='.repeat((4 - (b64u.length % 4)) % 4);
	const s = (b64u + pad).replace(/-/g, '+').replace(/_/g, '/');
	const bin = atob(s);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

export type JwtHeader = { alg: string; kid?: string; [k: string]: unknown };
export type JwtPayload = {
	aud?: string; iss?: string; sub?: string; exp?: number; nbf?: number; iat?: number;
	[k: string]: unknown;
};

export function parseJwt(token: string): { header: JwtHeader; payload: JwtPayload } | null {
	const parts = token.split('.');
	if (parts.length !== 3) return null;
	try {
		const header = JSON.parse(new TextDecoder().decode(b64uToBytes(parts[0])));
		const payload = JSON.parse(new TextDecoder().decode(b64uToBytes(parts[1])));
		return { header, payload };
	} catch {
		return null;
	}
}

/** ---------- JWKS (Google Secure Token) ---------- */

const JWKS_URL = 'https://identitytoolkit.googleapis.com/v1/sessionCookiePublicKeys';

type Jwk = {
	kid: string;
	kty: 'RSA';
	n: string;
	e: string;
	alg?: 'RS256';
	use?: 'sig';
};

let jwksCache: { keys: Record<string, CryptoKey>; exp: number } | null = null;

export async function importRsaKeyFromJwk(jwk: Jwk): Promise<CryptoKey> {
	// On donne à WebCrypto uniquement les champs JWK obligatoires
	const jwkMinimal = { kty: 'RSA', n: jwk.n, e: jwk.e, ext: true } as JsonWebKey;

	return crypto.subtle.importKey(
		'jwk',
		jwkMinimal,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['verify'],
	);
}

export async function getKeyByKid(kid: string): Promise<CryptoKey | null> {
	try {
		const now = Date.now();
		if (jwksCache && jwksCache.exp > now && jwksCache.keys[kid]) {
			return jwksCache.keys[kid];
		}

		const res = await fetch(JWKS_URL, { cache: 'no-store' });
		if (!res.ok) return null;

		const cc = res.headers.get('cache-control') || '';
		const m = /max-age=(\d+)/i.exec(cc);
		const ttlMs = m ? parseInt(m[1], 10) * 1000 : 3600_000;

		const json: unknown = await res.json();
		// L’endpoint v1 renvoie bien { keys: Jwk[] }
		const arr = Array.isArray((json as any)?.keys) ? ((json as any).keys as Jwk[]) : null;
		if (!arr) return null;

		const map: Record<string, CryptoKey> = {};
		for (const k of arr) {
			if (!k?.kid || k.kty !== 'RSA' || !k.n || !k.e) continue;
			try {
				map[k.kid] = await importRsaKeyFromJwk(k);
			} catch {
				// ignore une clé défectueuse, continue
			}
		}

		jwksCache = { keys: map, exp: now + ttlMs };
		return jwksCache.keys[kid] ?? null;
	} catch {
		return null;
	}
}

/** ---------- Vérification RS256 du Firebase Session Cookie ---------- */

export type VerifyResult =
	| { ok: true; payload: JwtPayload }
	| { ok: false; reason: string };

export async function verifyFirebaseSessionJWT(
	token: string,
	projectIdFromEnv?: string,
): Promise<VerifyResult> {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return { ok: false, reason: 'shape' };

		const parsed = parseJwt(token);
		if (!parsed) return { ok: false, reason: 'decode' };
		const { header, payload } = parsed;

		if (header.alg !== 'RS256') return { ok: false, reason: 'alg' };
		if (!header.kid) return { ok: false, reason: 'kid' };

		// 🔁 Priorité au projectId issu du token (aud), fallback env
		const pidFromToken = typeof payload.aud === 'string' ? payload.aud : undefined;
		const projectId = pidFromToken ?? projectIdFromEnv;
		if (!projectId) return { ok: false, reason: 'aud-missing' };

		const iss = `https://session.firebase.google.com/${projectId}`;
		if (payload.iss !== iss) return { ok: false, reason: 'iss' };
		if (payload.aud !== projectId) return { ok: false, reason: 'aud' };
		if (!payload.sub) return { ok: false, reason: 'sub' };

		const now = Math.floor(Date.now() / 1000);
		const leeway = 60;
		if (typeof payload.exp !== 'number' || payload.exp <= now - leeway) {
			return { ok: false, reason: 'exp' };
		}
		if (typeof payload.nbf === 'number' && payload.nbf > now + leeway) {
			return { ok: false, reason: 'nbf' };
		}

		const key = await getKeyByKid(header.kid);
		if (!key) return { ok: false, reason: 'key' };

		const signingInput = `${parts[0]}.${parts[1]}`;
		const sigBytes = b64uToBytes(parts[2]);
		const dataBytes = new TextEncoder().encode(signingInput);

		// Passe des ArrayBuffer “propres”
		const sigBuf = sigBytes.slice().buffer;
		const dataBuf = dataBytes.slice().buffer;

		const valid = await crypto.subtle.verify(
			{ name: 'RSASSA-PKCS1-v1_5' },
			key,
			sigBuf,
			dataBuf,
		);
		if (!valid) return { ok: false, reason: 'signature' };

		return { ok: true, payload };
	} catch {
		// Ne jamais faire planter le middleware
		return { ok: false, reason: 'exception' };
	}
}

/** ---------- Cookies helpers ---------- */

function buildPathCandidates(currentPath: string): string[] {
	// '/admin/a/b' -> ['/admin/a/b','/admin/a','/admin','/']
	const parts = currentPath.split('/').filter(Boolean);
	const paths: string[] = ['/'];
	let acc = '';
	for (const p of parts) {
		acc += `/${p}`;
		paths.push(acc);
	}
	// supprime les doublons et trie du plus long au plus court
	return Array.from(new Set(paths)).sort((a, b) => b.length - a.length);
}

export function purgeSessionCookie(
	res: NextResponse,
	isHttps: boolean,
	hostname: string,
	currentPath: string = '/'
) {
	const candidates = buildPathCandidates(currentPath);

	// Cookie partagé entre sous-domaines (prod)
	if (hostname.endsWith('calendis.fr')) {
		for (const path of candidates) {
			res.cookies.set('user', '', {
				path,
				domain: '.calendis.fr',
				httpOnly: true,
				sameSite: 'lax',
				secure: isHttps,
				maxAge: 0,
			});
		}
	}

	// Variante host-only (au cas où elle existerait)
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