export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const extractVersionFromScriptURL = (url?: string | null): string | null => {
	if (!url) return null;
	try {
		const u = new URL(url);
		const raw = u.search.slice(1);
		return raw || null;
	} catch {
		return null;
	}
}

const DB_NAME = 'firebaseLocalStorageDb';
const STORE   = 'firebaseLocalStorage';

export async function idbHasAuthUserEntry(apiKey?: string): Promise<boolean> {
	return new Promise((resolve) => {
		const req = indexedDB.open(DB_NAME);

		req.onupgradeneeded = () => resolve(false);
		req.onerror = () => resolve(false);

		req.onsuccess = () => {
			const db = req.result;
			const prefix = apiKey
				? `firebase:authUser:${apiKey}:`
				: `firebase:authUser:`;

			try {
				const tx = db.transaction(STORE, 'readonly');
				const store = tx.objectStore(STORE);

				let found = false;
				const cursorReq = store.openKeyCursor();
				cursorReq.onsuccess = () => {
					const c = cursorReq.result;
					if (!c) {
						resolve(found);
						db.close?.();
						return;
					}
					const key = String(c.key);
					if (key.startsWith(prefix)) {
						found = true;
						resolve(true);
						db.close?.();
						return;
					}
					c.continue();
				};
				cursorReq.onerror = () => {
					resolve(false);
					db.close?.();
				};
			} catch {
				resolve(false);
				db.close?.();
			}
		};
	});
}