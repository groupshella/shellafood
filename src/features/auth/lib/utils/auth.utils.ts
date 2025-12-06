import { STORAGE_KEYS, TOKEN_CONFIG } from '../../constants/auth.constants';
import type { AuthUser } from '../../types/auth.types';

// ============================================================================
// Authentication Utils
// ============================================================================

export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') return false;
	const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
	return !!token;
}

export function getCurrentUser(): AuthUser | null {
	if (typeof window === 'undefined') return null;
	
	const userStr = localStorage.getItem(STORAGE_KEYS.USER);
	if (!userStr) return null;
	
	try {
		return JSON.parse(userStr) as AuthUser;
	} catch {
		return null;
	}
}

export function saveUser(user: AuthUser): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function removeUser(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEYS.USER);
}

// ============================================================================
// Token Utils
// ============================================================================

export function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function saveAuthToken(token: string, remember?: boolean): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEYS.TOKEN, token);
	if (remember) {
		localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
	}
}

export function removeAuthToken(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEYS.TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
}

export function getAuthHeader(): string | null {
	const token = getAuthToken();
	if (!token) return null;
	return `${TOKEN_CONFIG.TOKEN_PREFIX} ${token}`;
}
