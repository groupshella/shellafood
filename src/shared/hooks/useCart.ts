'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/providers';

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

			// Call API to add to cart
			const response = await fetch('https://shellafood.com/api/v1/customer/cart/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify({
					guest_id: guestId,
					item_id: parseInt(productId),
					model: 'Item',
					price: priceAtAdd,
					quantity: quantity,
					variation: variation,
					add_on_ids: add_on_ids,
					add_on_qtys: add_on_qtys,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data) {
				return {
					success: false,
					error: data?.message || (language === 'ar' ? 'فشل في إضافة المنتج' : 'Failed to add product'),
				};
			}

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
	}, [language]);
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

			// Call API to add to cart
			const response = await fetch('https://shellafood.com/api/v1/customer/cart/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify({
					cart_id: cart_id,
					guest_id: guestId,
					price: price_at_add,
					quantity: quantity,
				}),
			});

			const data = await response.json();
console.log(data);
			if (!response.ok || !data) {
				return {
					success: false,
					error: data?.message || (language === 'ar' ? 'فشل في إضافة المنتج' : 'Failed to add product'),
				};
			}

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
	}, [language]);

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

			// Call API to remove item from cart
			const response = await fetch(
				`https://shellafood.com/api/v1/customer/cart/remove-item?cart_id=${cartId}&guest_id=${guestId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'x-localization': 'ar',
					},
				}
			);

			const data = await response.json();

			if (!response.ok || !data) {
				return {
					success: false,
					error: data?.message || (language === 'ar' ? 'فشل في حذف المنتج' : 'Failed to remove product'),
				};
			}

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
	}, [language]);

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

			// Call API to clear cart
			const response = await fetch(
				`https://shellafood.com/api/v1/customer/cart/remove?guest_id=${guestId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
							'x-localization': 'ar',
					},
				}
			);

			const data = await response.json();

			if (!response.ok || !data) {
				return {
					success: false,
					error: data?.message || (language === 'ar' ? 'فشل في مسح السلة' : 'Failed to clear cart'),
				};
			}

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
	}, [language]);

	return {
		addToCart,
		updateQuantityItem,
		removeCartItem,
		clearCart,
		isLoading,
	};
}