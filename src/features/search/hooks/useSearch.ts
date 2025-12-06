"use client";

import { useState, useCallback } from "react";
import { TEST_STORES, TEST_PRODUCTS } from "@/lib/data/categories/testData";
import type { SearchFilters, Store, Product, SearchQuery } from "../types";

export interface SearchResult {
	stores: Store[];
	products: Product[];
	total: number;
}

/**
 * Custom hook for search functionality
 */
export function useSearch() {
	const [isSearching, setIsSearching] = useState(false);

	const performSearch = useCallback(
		async ({ query, filters = {} }: SearchQuery): Promise<SearchResult> => {
			if (!query.trim()) {
				return { stores: [], products: [], total: 0 };
			}

			setIsSearching(true);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			try {
				const searchLower = query.toLowerCase();

				// Filter stores
				let storeResults: Store[] = TEST_STORES.filter((store) => {
					const nameMatch = store.name?.toLowerCase().includes(searchLower);
					const nameArMatch = store.nameAr?.toLowerCase().includes(searchLower);
					const descMatch = store.description?.toLowerCase().includes(searchLower);
					return nameMatch || nameArMatch || descMatch;
				}) as Store[];

				// Filter products
				let productResults: Product[] = TEST_PRODUCTS.filter((product) => {
					const nameMatch = product.name?.toLowerCase().includes(searchLower);
					const nameArMatch = product.nameAr?.toLowerCase().includes(searchLower);
					return nameMatch || nameArMatch;
				}) as Product[];

				// Apply filters
				if (filters.minRating) {
					storeResults = storeResults.filter(
						(store) => (store.rating ?? 0) >= filters.minRating!
					);
				}

				if (filters.priceRange) {
					const { min, max } = filters.priceRange;
					productResults = productResults.filter((product) => {
						const price = product.price || 0;
						return price >= min && price <= max;
					});
				}

				// Sort results
				if (filters.sortBy === "rating") {
					storeResults.sort((a, b) => {
						const ratingA = a.rating ?? 0;
						const ratingB = b.rating ?? 0;
						return ratingB - ratingA;
					});
				} else if (filters.sortBy === "price_low" || filters.sortBy === "price_high") {
					productResults.sort((a, b) => {
						const priceA = a.price || 0;
						const priceB = b.price || 0;
						return filters.sortBy === "price_low" ? priceA - priceB : priceB - priceA;
					});
				}

				return {
					stores: storeResults,
					products: productResults,
					total: storeResults.length + productResults.length,
				};
			} finally {
				setIsSearching(false);
			}
		},
		[]
	);

	return {
		performSearch,
		isSearching,
	};
}

