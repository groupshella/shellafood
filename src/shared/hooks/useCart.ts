'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/providers';
import { getBaseUrl } from '@/features/(actors)/auth/constants/auth.constants';

interface AddToCartParams {
	productId: string;
	storeId: string;
	quantity?: number;
	productName?: string;
	productNameAr?: string;
	productImage?: string;
	priceAtAdd: number;
	storeName?: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
	variation?: any[];
	add_on_ids?: any[];
	add_on_qtys?: any[];
}

interface UpdateQuantityParams {
	cart_id: string;
	price_at_add: number;
	quantity: number;
}

interface AddToCartResponse {
	success?: boolean;
	message?: string;
	error?: string;
	requiresClearCart?: boolean;
	data?: any;
}

interface UpdateQuantityResponse {
	success?: boolean;
	message?: string;
	error?: string;
	data?: any;
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

export function useCart() {
	const [isLoading, setIsLoading] = useState(false);
	const { language } = useLanguage();
	const baseUrl = getBaseUrl();

	const addToCart = useCallback(async ({
		productId,
		quantity = 1,
		priceAtAdd,
		variation,
		add_on_ids,
		add_on_qtys,
	}: AddToCartParams): Promise<AddToCartResponse> => {
		setIsLoading(true);
		try {
			// Get guest_id from cookie
			const guestId = getCookie('guest_id');

			if (!guestId) {
				return {
					success: false,
					error: language === 'ar' ? 'جلسة غير صالحة' : 'Invalid session',
				};
			}

			// ✅ Use API route as proxy
			const response = await fetch(`${baseUrl}/api/cart/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify({
					item_id: parseInt(productId),
					guest_id: guestId,
					model: 'Item',
					price: priceAtAdd,
					quantity: quantity,
					variation: variation || [],
					add_on_ids: add_on_ids || [],
					add_on_qtys: add_on_qtys || [],
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to add to cart' }));
				return {
					success: false,
					error: errorData?.error || errorData?.message || (language === 'ar' ? 'فشل في إضافة المنتج' : 'Failed to add product'),
				};
			}

			const data = await response.json();

			// Trigger storage event for cart count update
			window.dispatchEvent(new Event('cartUpdated'));

			return {
				success: true,
				message: data?.message || (language === 'ar' ? 'تم إضافة المنتج للسلة' : 'Product added to cart'),
				data: data,
			};
		} catch (error) {
			console.error('Error adding to cart:', error);
			return {
				success: false,
				error: language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error',
			};
		} finally {
			setIsLoading(false);
		}
	}, [language, baseUrl]);
	const updateQuantityItem = useCallback(async ({
		cart_id,
		price_at_add,
		quantity,
	}: UpdateQuantityParams): Promise<UpdateQuantityResponse> => {
		setIsLoading(true);
		try {
			// Get guest_id from cookie
			const guestId = getCookie('guest_id');

			if (!guestId) {
				return {
					success: false,
					error: language === 'ar' ? 'جلسة غير صالحة' : 'Invalid session',
				};
			}

			// ✅ Use API route as proxy
			const response = await fetch(`${baseUrl}/api/cart/update`, {
				method: 'Post',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify({
					cart_id: cart_id,
					price: price_at_add,
					quantity: quantity,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to update cart' }));
				return {
					success: false,
					error: errorData?.error || errorData?.message || (language === 'ar' ? 'فشل في تحديث المنتج' : 'Failed to update product'),
				};
			}

			const data = await response.json();

			// Trigger storage event for cart count update
			window.dispatchEvent(new Event('cartUpdated'));

			return {
				success: true,
				message: data?.message || (language === 'ar' ? 'تم تحديث المنتج' : 'Product updated'),
				data: data,
			};
		} catch (error) {
			console.error('Error updating cart:', error);
			return {
				success: false,
				error: language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error',
			};
		} finally {
			setIsLoading(false);
		}
	}, [language, baseUrl]);

	const removeCartItem = useCallback(async (cartId: string): Promise<AddToCartResponse> => {
		setIsLoading(true);
		try {
			// Get guest_id from cookie
			const guestId = getCookie('guest_id');

			if (!guestId) {
				return {
					success: false,
					error: language === 'ar' ? 'جلسة غير صالحة' : 'Invalid session',
				};
			}

			// ✅ Use API route as proxy
			const response = await fetch(
				`${baseUrl}/api/cart/remove-item?cart_id=${cartId}&guest_id=${guestId}`,
				{
					method: 'DELETE',
					headers: {
						'Accept': 'application/json',
						'x-localization': 'ar',
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to remove item' }));
				return {
					success: false,
					error: errorData?.error || errorData?.message || (language === 'ar' ? 'فشل في حذف المنتج' : 'Failed to remove product'),
				};
			}

			const data = await response.json().catch(() => ({}));

			// Trigger storage event for cart count update
			window.dispatchEvent(new Event('cartUpdated'));

			return {
				success: true,
				message: data?.message || (language === 'ar' ? 'تم حذف المنتج من السلة' : 'Product removed from cart'),
				data: data,
			};
		} catch (error) {
			console.error('Error removing item from cart:', error);
			return {
				success: false,
				error: language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error',
			};
		} finally {
			setIsLoading(false);
		}
	}, [language, baseUrl]);

	const clearCart = useCallback(async (): Promise<AddToCartResponse> => {
		setIsLoading(true);
		try {
			// Get guest_id from cookie
			const guestId = getCookie('guest_id');

			if (!guestId) {
				return {
					success: false,
					error: language === 'ar' ? 'جلسة غير صالحة' : 'Invalid session',
				};
			}

			// ✅ Use API route as proxy
			const response = await fetch(
				`${baseUrl}/api/cart/remove?guest_id=${guestId}`,
				{
					method: 'DELETE',
					headers: {
						'Accept': 'application/json',
						'x-localization': 'ar',
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to clear cart' }));
				return {
					success: false,
					error: errorData?.error || errorData?.message || (language === 'ar' ? 'فشل في مسح السلة' : 'Failed to clear cart'),
				};
			}

			const data = await response.json().catch(() => ({}));

			// Trigger storage event for cart count update
			window.dispatchEvent(new Event('cartUpdated'));

			return {
				success: true,
				message: data?.message || (language === 'ar' ? 'تم مسح السلة' : 'Cart cleared successfully'),
				data: data,
			};
		} catch (error) {
			console.error('Error clearing cart:', error);
			return {
				success: false,
				error: language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error',
			};
		} finally {
			setIsLoading(false);
		}
	}, [language, baseUrl]);

	return {
		addToCart,
		updateQuantityItem,
		removeCartItem,
		clearCart,
		isLoading,
	};
}