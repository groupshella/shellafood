"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import { useFilters, useMobile } from "@/shared/hooks";
import type { Store } from "../types/store.types";
import type { StoreList } from "../types/store.types";

export type MobileViewMode = "single" | "double";

export interface UseCategoryViewProps {	
	stores: StoreList;
}

export interface UseCategoryViewReturn {
	// Language & Direction
	language: string;
	isArabic: boolean;
	direction: "rtl" | "ltr";

	// State
	mobileViewMode: MobileViewMode;
	setMobileViewMode: (mode: MobileViewMode) => void;
	showFilters: boolean;
	setShowFilters: (show: boolean) => void;
	currentPage: number;
	isMobile: boolean;

	// Filters
	filters: ReturnType<typeof useFilters>["filters"];
	hasActiveFilters: boolean;
	handleFilterChange: (filterType: string, value: any) => void;
	handleClearFilters: () => void;

	// Computed values
	itemsPerPage: number;
	breadcrumbItems: Array<{ label: string; href?: string }>;
	filteredAndSortedStores: Store[];
	paginatedStores: Store[];
	totalPages: number;

	// Handlers
	handleStoreClick: (store: Store) => void;
	handlePageChange: (page: number) => void;

	// Translations
	translations: {
		title: string;
		subtitle: string;
		description: string;
		filters: string;
		noStores: string;
		noStoresDesc: string;
		results: string;
	};
}

/**
 * Hook for CategoryView component logic
 * Manages filtering, sorting, pagination, and view state
 */
export function useCategoryView({
	stores,
}: UseCategoryViewProps): UseCategoryViewReturn {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const isMobile = useMobile(768);
	const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();

	// Safety check: ensure stores array exists and has items
	const safeStores = stores?.stores || [];
	const firstStore = safeStores[0];

	// State
	const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>("single");
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Responsive items per page
	const itemsPerPage = useMemo(() => {
		if (isMobile) {
			return mobileViewMode === "double" ? 2 : 2; // Very low for testing with 4 restaurants
		}
		return 2; // Desktop and tablet - Very low for testing (should be 12 normally)
	}, [isMobile, mobileViewMode]);

	// Breadcrumb items
	const breadcrumbItems = useMemo(
		() => [
			{ label: isArabic ? "الرئيسية" : "Home", href: "/home" },
			{
				label: isArabic ? "الأقسام" : "Categories",
				href: "/categories",
			},
			{ label: firstStore?.module?.module_name || (isArabic ? "القسم" : "Category") },
		],
		[firstStore?.module?.module_name, isArabic]
	);

	// Handle store click
	const handleStoreClick = useCallback(
		(store: Store) => {
			
		},
		[]
	);

	// Filter and sort stores
	const filteredAndSortedStores = useMemo(() => {
		let result = [...safeStores];

		// Apply filters
		if (filters.rating.length > 0) {
			result = result.filter((store) => {
				const rating = typeof store.ratings === "number" ? store.ratings : parseFloat(String(store.ratings || "0"));
				return filters.rating.some((r) => rating >= r);
			});
		}

		if (filters.features.openNow) {
			result = result.filter((store) => store.status?.is_open === true);
		}

		if (filters.features.freeDelivery) {
			result = result.filter((store) => {
				// Check if store has free delivery (mock check since fee doesn't exist in Store type)
				// In real app, this would check store.deliveryFee or similar property
				const hash = store.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
				return hash % 2 === 0; // ~50% of stores have free delivery
			});
		}

		if (filters.features.offers) {
			// Mock: Check if store has offers (in real app, check store.hasOffers or store.offers)
			// Using store ID hash to determine offers (consistent mock behavior)
			result = result.filter((store) => {
				const hash = store.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
				return hash % 3 === 0; // ~33% of stores have offers
			});
		}

		if (filters.features.previouslyOrdered) {
			// Mock: Check if user has ordered from this store before
			// In real app, check user's order history
			// For now, use a mock list based on store ID hash
			result = result.filter((store) => {
				const hash = store.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
				return hash % 4 === 0; // ~25% of stores are previously ordered
			});
		}

		if (filters.distanceRange[1] < 50) {
			result = result.filter((store) => {
				// Mock distance calculation based on store ID hash
				// In real app, this would use actual location data
				const hash = store.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
				const mockDistance = hash % 10;
				return mockDistance >= filters.distanceRange[0] && mockDistance <= filters.distanceRange[1];
			});
		}

		// Apply sorting - default to rating (highest first)
		result.sort((a, b) => {
			const ratingA = typeof a.ratings === "number" ? a.ratings : parseFloat(String(a.ratings || "0"));
			const ratingB = typeof b.ratings === "number" ? b.ratings : parseFloat(String(b.ratings	 || "0"));
			return ratingB - ratingA;
		});

		return result;
	}, [safeStores, filters]);

	// Paginate stores
	const paginatedStores = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredAndSortedStores.slice(startIndex, endIndex);
	}, [filteredAndSortedStores, currentPage, itemsPerPage]);

	// Calculate total pages
	const totalPages = useMemo(() => {
		return Math.ceil(filteredAndSortedStores.length / itemsPerPage) || 1;
	}, [filteredAndSortedStores.length, itemsPerPage]);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [
		filters.rating.length,
		filters.features.openNow,
		filters.features.freeDelivery,
		filters.features.offers,
		filters.features.previouslyOrdered,
		filters.distanceRange[0],
		filters.distanceRange[1],
	]);

	// Reset to page 1 when view mode changes
	useEffect(() => {
		setCurrentPage(1);
	}, [mobileViewMode]);

	// Reset to page 1 if current page is invalid
	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [totalPages, currentPage]);

	// Handle page change with smooth scroll
	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);

		// Smooth scroll to top of stores list
		setTimeout(() => {
			const storesElement = document.getElementById("stores-list");
			if (storesElement) {
				const offset = 100; // Header offset
				const elementPosition = storesElement.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.pageYOffset - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			} else {
				// Fallback to top of page
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}, 100);
	}, []);

	// Handle filter changes - reset to page 1
	const handleFilterChange = useCallback(
		(filterType: string, value: any) => {
			setCurrentPage(1);
			updateFilter(filterType, value);
		},
		[updateFilter]
	);

	// Handle clear filters - reset to page 1
	const handleClearFilters = useCallback(() => {
		setCurrentPage(1);
		clearFilters();
	}, [clearFilters]);

	// Translations
	const translations = useMemo(
		() => ({
			title: firstStore?.module?.module_name || (isArabic ? "القسم" : "Category"),
			subtitle: isArabic
				? "اكتشف أفضل المتاجر والمطاعم في هذا القسم"
				: "Discover the best stores and restaurants in this category",
			description: `${filteredAndSortedStores.length} ${isArabic ? "متجر متاح" : "stores available"}`,
			filters: isArabic ? "الفلاتر" : "Filters",
			noStores: isArabic
				? "لا توجد متاجر متاحة في هذا القسم"
				: "No stores available in this category",
			noStoresDesc: isArabic ? "يرجى التحقق مرة أخرى لاحقاً" : "Please check back later",
			results: isArabic ? "نتيجة" : "results",
		}),
			[firstStore?.module?.module_name, isArabic, filteredAndSortedStores.length]
	);

	return {
		// Language & Direction
		language,
		isArabic,
		direction,

		// State
		mobileViewMode,
		setMobileViewMode,
		showFilters,
		setShowFilters,
		currentPage,
		isMobile,

		// Filters
		filters,
		hasActiveFilters,
		handleFilterChange,
		handleClearFilters,

		// Computed values
		itemsPerPage,
		breadcrumbItems,
		filteredAndSortedStores,
		paginatedStores,
		totalPages,

		// Handlers
		handleStoreClick,
		handlePageChange,

		// Translations
		translations,
	};
}

