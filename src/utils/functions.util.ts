export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function extractVersionFromScriptURL(url?: string | null): string | null {
	if (!url) return null;
	try {
		const u = new URL(url);
		const raw = u.search.slice(1);
		return raw || null;
	} catch {
		return null;
	}
}