"use client";

/**
 * Hook for HomePage logic
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCartItemsCount } from "@/lib/utils/cartStorage";
import { HOME_CONSTANTS } from "../constants/home.constants";
import type { DeliveryAddress } from "../types";

export function useHomePage() {
	const router = useRouter();
	const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<DeliveryAddress | null>(null);
	const [cartCount, setCartCount] = useState(0);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	const handleDeliveryAddressChange = useCallback((address: DeliveryAddress | null) => {
		setSelectedDeliveryAddress(address);
	}, []);

	// Update cart count
	useEffect(() => {
		const updateCartCount = () => {
			setCartCount(getCartItemsCount());
		};

		updateCartCount();
		window.addEventListener(HOME_CONSTANTS.CART_UPDATE_EVENT, updateCartCount);
		return () => window.removeEventListener(HOME_CONSTANTS.CART_UPDATE_EVENT, updateCartCount);
	}, []);

	// Prefetch common routes
	useEffect(() => {
		HOME_CONSTANTS.PREFETCH_ROUTES.forEach((route) => router.prefetch(route));
	}, [router]);

	// Handle scroll to top visibility
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollToTop(window.scrollY > HOME_CONSTANTS.SCROLL_TO_TOP_THRESHOLD);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	return {
		selectedDeliveryAddress,
		cartCount,
		showScrollToTop,
		handleDeliveryAddressChange,
		scrollToTop,
	};
}

