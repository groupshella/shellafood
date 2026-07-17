/**
 * Rewrites backend HTTP media URLs to a same-origin proxy path so HTTPS pages
 * do not hit mixed-content blocks when `images.unoptimized` is enabled.
 */

export const MEDIA_PROXY_PREFIX = "/backend-media";

function getApiBase(): string {
	return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

/**
 * Convert an absolute backend media URL (often http://…) into `/backend-media/...`
 * which Next rewrites to the API host server-side.
 */
export function toSecureMediaUrl(src: string | null | undefined): string {
	if (!src) return "";

	// Local / data / already-proxied — leave alone
	if (
		src.startsWith("/") ||
		src.startsWith("data:") ||
		src.startsWith("blob:") ||
		src.startsWith(MEDIA_PROXY_PREFIX)
	) {
		return src;
	}

	const apiBase = getApiBase();
	if (!apiBase) return src;

	try {
		const url = new URL(src, apiBase);
		const api = new URL(apiBase);

		if (url.hostname === api.hostname) {
			return `${MEDIA_PROXY_PREFIX}${url.pathname}${url.search}`;
		}

		// Non-API http host: prefer https when possible
		if (url.protocol === "http:") {
			url.protocol = "https:";
			return url.href;
		}

		return src;
	} catch {
		return src;
	}
}
