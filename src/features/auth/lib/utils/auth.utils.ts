import { STORAGE_KEYS, TOKEN_CONFIG } from '../../constants/auth.constants';
import type { AuthUser } from '../../types/auth.types';
import { setCookie, getCookie, removeCookie, hasCookie } from './cookie.utils';

// ============================================================================
// Authentication Utils
// ============================================================================

export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') return false;
	const token = getCookie(STORAGE_KEYS.TOKEN);
	return !!token;
}

export function getCurrentUser(): AuthUser | null {
	if (typeof window === 'undefined') return null;
	
	const userStr = getCookie(STORAGE_KEYS.USER);
	if (!userStr) return null;
	
	try {
		return JSON.parse(userStr) as AuthUser;
	} catch {
		return null;
	}
}

export function saveUser(user: AuthUser): void {
	if (typeof window === 'undefined') return;
	// Store user data in cookie (7 days expiration)
	setCookie(STORAGE_KEYS.USER, JSON.stringify(user), 7, {
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
	});
}

export function removeUser(): void {
	if (typeof window === 'undefined') return;
	removeCookie(STORAGE_KEYS.USER);
}

// ============================================================================
// Token Utils
// ============================================================================

export function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null;
	return getCookie(STORAGE_KEYS.TOKEN);
}

export function saveAuthToken(token: string, remember?: boolean): void {
	if (typeof window === 'undefined') return;
	
	// If remember is true, set cookie for 30 days, otherwise 7 days
	const days = remember ? 30 : 7;
	
	setCookie(STORAGE_KEYS.TOKEN, token, days, {
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
	});
	
	if (remember) {
		setCookie(STORAGE_KEYS.REMEMBER_ME, 'true', 30, {
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});
	} else {
		removeCookie(STORAGE_KEYS.REMEMBER_ME);
	}
}

export function removeAuthToken(): void {
	if (typeof window === 'undefined') return;
	removeCookie(STORAGE_KEYS.TOKEN);
	removeCookie(STORAGE_KEYS.REMEMBER_ME);
}

export function getAuthHeader(): string | null {
	const token = getAuthToken();
	if (!token) return null;
	return `${TOKEN_CONFIG.TOKEN_PREFIX} ${token}`;
}
