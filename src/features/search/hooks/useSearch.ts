"use client";

import { useState, useCallback, useMemo } from "react";
import { searchItemOrStore } from "../api/search.api";
import { getSearchLocationFromCookie } from "../lib/getSearchLocation";
import { mapSearchItemToProduct, mapSearchStoreToApiStore } from "../lib/mapSearchResults";
import { SEARCH_CONSTANTS } from "../constants/search.constants";
import type { SearchRequestContext } from "../types";
import type { Product } from "@/shared/components";
import type { ApiStore } from "@/features/home/types/store.types";

export interface SearchResult {
	products: Product[];
	stores: ApiStore[];
	total: number;
}

export interface UseSearchOptions extends SearchRequestContext {}

/**
 * Search hook — calls `GET /api/v1/items/item-or-store-search`.
 */
export function useSearch(options: UseSearchOptions = {}) {
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const context = useMemo<SearchRequestContext>(() => {
		const cookieLocation = getSearchLocationFromCookie();
		const moduleId = options.moduleId ?? SEARCH_CONSTANTS.DEFAULT_MODULE_ID;

		return {
			lang: options.lang ?? SEARCH_CONSTANTS.DEFAULT_LANG,
			zoneId: options.zoneId ?? SEARCH_CONSTANTS.DEFAULT_ZONE_ID,
			moduleId,
			latitude: options.latitude ?? cookieLocation?.lat ?? SEARCH_CONSTANTS.DEFAULT_LATITUDE,
			longitude: options.longitude ?? cookieLocation?.lng ?? SEARCH_CONSTANTS.DEFAULT_LONGITUDE,
		};
	}, [options.lang, options.zoneId, options.moduleId, options.latitude, options.longitude]);

	const performSearch = useCallback(
		async (name: string): Promise<SearchResult> => {
			if (!name.trim()) {
				return { products: [], stores: [], total: 0 };
			}

			setIsSearching(true);
			setError(null);

			try {
				const res = await searchItemOrStore({ name: name.trim() }, context);

				if (!res.success || !res.data) {
					setError(res.error ?? "Search failed");
					return { products: [], stores: [], total: 0 };
				}

				const products = res.data.items.map(mapSearchItemToProduct);
				const stores = res.data.stores.map((s) =>
					mapSearchStoreToApiStore(s, Number(context.moduleId) || 3),
				);

				return {
					products,
					stores,
					total: products.length + stores.length,
				};
			} finally {
				setIsSearching(false);
			}
		},
		[context],
	);

	return { performSearch, isSearching, error };
}
