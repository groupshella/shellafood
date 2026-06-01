/**
 * Cookie Utilities for Client-Side
 * Simple cookie helper functions for browser environment
 */

// ============================================================================
// Cookie Helper Functions
// ============================================================================

/**
 * Set a cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 * @param options - Additional cookie options
 */
export function setCookie(
	name: string,
	value: string,
	days: number = 7,
	options: {
		secure?: boolean;
		sameSite?: 'strict' | 'lax' | 'none';
		path?: string;
	} = {}
): void {
	if (typeof document === 'undefined') return;

	const {
		secure = process.env.NODE_ENV === 'production',
		sameSite = 'lax',
		path = '/',
	} = options;

	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

	let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path};SameSite=${sameSite}`;

	if (secure) {
		cookieString += ';Secure';
	}

	document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;

	const nameEQ = encodeURIComponent(name) + '=';
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i];
		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(nameEQ) === 0) {
			return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
		}
	}

	return null;
}

/**
 * Remove a cookie
 * @param name - Cookie name
 * @param path - Cookie path (default: '/')
 */
export function removeCookie(
	name: string,
	options?: {
	  path?: string;
	  domain?: string;
	  secure?: boolean;
	}
  ): void {
	if (typeof document === "undefined") return;
  
	const {
	  path = "/",
	  domain,
	  secure = window.location.protocol === "https:",
	} = options || {};
  
	document.cookie = [
	  `${encodeURIComponent(name)}=`,
	  `expires=Thu, 01 Jan 1970 00:00:00 UTC`,
	  `path=${path}`,
	  domain ? `domain=${domain}` : "",
	  secure ? "Secure" : "",
	  "SameSite=Lax",
	]
	  .filter(Boolean)
	  .join("; ");
  }
  

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists
 */
export function hasCookie(name: string): boolean {
	return getCookie(name) !== null;
}

