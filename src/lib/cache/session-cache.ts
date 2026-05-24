// lib/cache/session-cache.ts

/**
 * Session Storage Cache Manager
 * Provides type-safe caching with automatic JSON serialization
 */
class SessionCache {
	/**
	 * Check if running in browser
	 */
	private isBrowser(): boolean {
		return typeof window !== 'undefined';
	}

	/**
	 * Get data from session storage
	 */
	get<T>(key: string): T | null {
		if (!this.isBrowser()) {
			return null;
		}

		try {
			const cached = sessionStorage.getItem(key);
			if (!cached) {
				return null;
			}

			const data = JSON.parse(cached);

			return data as T;
		} catch (error) {
			console.error(`Error reading cache for key "${key}":`, error);
			this.remove(key);
			return null;
		}
	}

	/**
	 * Set data in session storage
	 */
	set<T>(key: string, data: T): boolean {
		if (!this.isBrowser()) {
			return false;
		}

		try {
			sessionStorage.setItem(key, JSON.stringify(data));
			return true;
		} catch (error) {
			console.error(`Error saving cache for key "${key}":`, error);
			// Quota exceeded - try to clear old caches
			if (error instanceof Error && error.name === 'QuotaExceededError') {
				console.warn('Session storage quota exceeded, clearing cache');
				this.clearAll();
			}
			return false;
		}
	}

	/**
	 * Remove specific key from session storage
	 */
	remove(key: string): void {
		if (!this.isBrowser()) {
			return;
		}

		sessionStorage.removeItem(key);
	}

	/**
	 * Check if key exists in cache
	 */
	has(key: string): boolean {
		if (!this.isBrowser()) {
			return false;
		}

		return sessionStorage.getItem(key) !== null;
	}

	/**
	 * Clear all items matching a prefix
	 */
	clearByPrefix(prefix: string): void {
		if (!this.isBrowser()) {
			return;
		}

		const keys = Object.keys(sessionStorage);
		let count = 0;

		keys.forEach(key => {
			if (key.startsWith(prefix)) {
				sessionStorage.removeItem(key);
				count++;
			}
		});

	}

	/**
	 * Clear all session storage
	 */
	clearAll(): void {
		if (!this.isBrowser()) {
			return;
		}

		sessionStorage.clear();
	}

	/**
	 * Get all keys in session storage
	 */
	getAllKeys(): string[] {
		if (!this.isBrowser()) {
			return [];
		}

		return Object.keys(sessionStorage);
	}

	/**
	 * Get cache size info
	 */
	getSize(): { used: number; keys: number } {
		if (!this.isBrowser()) {
			return { used: 0, keys: 0 };
		}

		let totalSize = 0;
		const keys = Object.keys(sessionStorage);

		keys.forEach(key => {
			const value = sessionStorage.getItem(key);
			if (value) {
				totalSize += key.length + value.length;
			}
		});

		return {
			used: totalSize, // in characters (roughly bytes)
			keys: keys.length
		};
	}

	/**
	 * Get or set with fallback function
	 * If cache exists, return it. Otherwise, call fallback and cache result
	 */
	async getOrSet<T>(
		key: string,
		fallback: () => Promise<T>
	): Promise<T> {
		// Try to get from cache first
		const cached = this.get<T>(key);
		if (cached !== null) {
			return cached;
		}

		// Cache miss - call fallback
		const data = await fallback();

		// Save to cache
		this.set(key, data);

		return data;
	}
}

// Export singleton instance
export const sessionCache = new SessionCache();

// Export class for custom instances if needed
export { SessionCache };