/** @type {Window | WorkerGlobalScope} */
const sw = self;

/** SERVICE WORKER */

const VERSION = new URL(sw.location.href).search.slice(1) || '0.0.0';
const APP_CACHE = `app-${VERSION}`;
const ASSETS_CACHE = `assets-${VERSION}`;
const ASSETS = [
	'/',
];

/**
 * Install event
 * Triggered when the service worker is first installed.
 * - Enables navigation preload for faster page loads.
 * - Opens the application cache and adds predefined assets.
 * - Calls skipWaiting() so this SW becomes active immediately after install.
 * @param {ExtendableEvent} event
 */
sw.addEventListener('install', (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(APP_CACHE);

		try {
			if (ASSETS.length) await cache.addAll(ASSETS);
		} catch {}
	})());
});

/**
 * Activate event
 * Triggered when the service worker becomes active.
 * - Deletes any old caches not matching the current version.
 * - Claims control of all clients (open pages) immediately.
 * @param {ExtendableEvent} event
 */
sw.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		if ('navigationPreload' in sw.registration) {
			await sw.registration.navigationPreload.enable();
		}

		const keys = await caches.keys();

		await Promise.all(
			keys.filter((k) => ![APP_CACHE, ASSETS_CACHE].includes(k))
				.map((k) => caches.delete(k))
		);

		await sw.clients.claim();
	})());
});

/**
 * Fetch event
 * Intercepts network requests made by the controlled pages.
 * - For navigation/HTML requests: uses network-first strategy with offline fallback.
 * - For static/runtime assets: uses stale-while-revalidate strategy (serve from cache, update in background).
 * @param {FetchEvent} event
 */
sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);
	const acceptsHTML = (req.headers.get('accept') || '').includes('text/html');

	if (req.mode === 'navigate' || acceptsHTML) {
		event.respondWith((async () => {
			try {
				const preload = await event.preloadResponse;
				return preload || await fetch(req);
			} catch {
				const cache = await caches.open(APP_CACHE);
				const cached = await cache.match('/');
				return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
			}
		})());
		return;
	}

	if (url.pathname.startsWith('/api/')) return;

	if (
		url.pathname.startsWith('/_next/') ||
		url.pathname.startsWith('/static/') ||
		url.pathname.startsWith('/assets/')
	) {
		event.respondWith((async () => {
			const cache = await caches.open(ASSETS_CACHE);
			const cached = await cache.match(req);
			const network = fetch(req).then((res) => {
				if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
					cache.put(req, res.clone()).catch(() => {});
				}
				return res;
			}).catch(() => cached);
			return cached || network;
		})());
	}
});

/**
 * Message event
 * Receives messages sent from the controlled pages or other scripts.
 * - GET_VERSION: replies with the current SW version.
 * - SKIP_WAITING: immediately activates the new SW version.
 * @param {ExtendableMessageEvent} event
 */
sw.addEventListener('message', (event) => {
	const type = event.data?.type;

	if (type === 'GET_VERSION') {
		event.ports?.[0]?.postMessage({ type: 'VERSION', version: VERSION });
	}

	if (type === 'SKIP_WAITING') {
		event.waitUntil(sw.skipWaiting());
	}
});