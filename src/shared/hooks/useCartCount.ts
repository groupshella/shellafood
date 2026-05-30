'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBaseUrl } from '@/features/auth/constants/auth.constants';
import { extractCartRowsForCount, sumCartLineQuantities } from '@/shared/lib/cartCountFromResponse';

// Helper function to get cookie value
function getCookie(name: string): string | null {
	if (typeof window === 'undefined') return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

export function useCartCount() {
	const [count, setCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const fetchCartCount = useCallback(async () => {
		try {
			const guestId = getCookie('guest_id');
			
			if (!guestId) {
				setCount(0);
				setIsLoading(false);
				return;
			}

			// ✅ Use API route as proxy
			const baseUrl = getBaseUrl();
			const response = await fetch(`${baseUrl}/api/cart/list?guest_id=${guestId}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'x-localization': 'ar',
				},
				cache: 'no-store',
			});

			if (response.ok) {
				const data = await response.json();
				const rows = extractCartRowsForCount(data);
				setCount(sumCartLineQuantities(rows));
			} else {
				setCount(0);
			}
		} catch (error) {
			console.error('Error fetching cart count:', error);
			setCount(0);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCartCount();

		// Listen for cart updates
		const handleCartUpdate = () => {
			fetchCartCount();
		};

		window.addEventListener('cartUpdated', handleCartUpdate);
		
		return () => {
			window.removeEventListener('cartUpdated', handleCartUpdate);
		};
	}, [fetchCartCount]);

	return { count, isLoading, refetch: fetchCartCount };
}


