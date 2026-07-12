"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    GetStoresResponse,
    StoreFilters,
    DEFAULT_FILTERS,
    hasActiveFilters,
} from "@/features/markets/types/stores.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

const PAGE_SIZE = 30;

function buildParams(
    moduleId: string,
    filters: StoreFilters,
    limit: number,
    offset: number,
    isArabic: boolean = false,
): URLSearchParams {
    const params = new URLSearchParams({
        module_id: moduleId,
        limit: String(limit),
        offset: String(offset),
        "X-localization": isArabic ? "ar" : "en",
        "Accept-Language": isArabic ? "ar" : "en",
    });

    if (filters.categoryId !== null) params.set("category_id", String(filters.categoryId));
    if (filters.hasOffer) params.set("has_offer", "1");
    if (filters.freeDelivery) params.set("free_delivery", "1");
    if (filters.topRated) params.set("top_rated", "1");
    if (filters.openNow) params.set("open_now", "1");
    if (filters.under30Min) params.set("under_30_min", "1");

    return params;
}

export function useStores(moduleId: string, isArabic: boolean = false) {
    const [stores, setStores] = useState<GetStoresResponse["stores"]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<StoreFilters>(DEFAULT_FILTERS);
    const loadedCountRef = useRef(0);
    /** Skip the next filters-effect fetch (used after SSR hydrate). */
    const skipNextFetchRef = useRef(false);
    /** Become true after SSR hydrate or fallback timeout so we don't race the server render. */
    const [fetchEnabled, setFetchEnabled] = useState(false);

    const fetchStores = useCallback(
        async (
            nextOffset: number,
            append: boolean,
            activeFilters: StoreFilters,
            signal?: AbortSignal,
        ) => {
            setError(null);
            append ? setIsLoadingMore(true) : setIsLoading(true);

            try {
                const params = buildParams(moduleId, activeFilters, PAGE_SIZE, nextOffset, isArabic);
                const res = await fetch(`/api/module/stores?${params}`, { signal });
                const json = (await res.json()) as ApiResponse<GetStoresResponse>;
                const data = unwrap(json);
                setStores((prev) => {
                    const next = append
                        ? [...prev, ...(data.stores ?? [])]
                        : (data.stores ?? []);
                    loadedCountRef.current = next.length;
                    return next;
                });
                setTotalSize(data.total_size ?? 0);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Failed to load stores");
                if (!append) {
                    setStores([]);
                    loadedCountRef.current = 0;
                }
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [moduleId],
    );

    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    const hydrateFromServer = useCallback((data: GetStoresResponse) => {
        // Don't overwrite if the user already applied filters from categories/chips.
        if (hasActiveFilters(filtersRef.current)) {
            setFetchEnabled(true);
            return;
        }

        setStores(data.stores ?? []);
        setTotalSize(data.total_size ?? 0);
        loadedCountRef.current = data.stores?.length ?? 0;
        setIsLoading(false);
        setError(null);
        skipNextFetchRef.current = true;
        setFetchEnabled(true);
    }, []);

    // If Stores SSR never hydrates (or filters change first), enable client fetching.
    useEffect(() => {
        if (fetchEnabled) return;
        if (hasActiveFilters(filters)) {
            setFetchEnabled(true);
            return;
        }
        const timer = window.setTimeout(() => setFetchEnabled(true), 50);
        return () => window.clearTimeout(timer);
    }, [fetchEnabled, filters]);

    useEffect(() => {
        if (!fetchEnabled) return;

        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false;
            return;
        }

        const controller = new AbortController();
        loadedCountRef.current = 0;
        void fetchStores(0, false, filters, controller.signal);
        return () => controller.abort();
    }, [fetchEnabled, fetchStores, filters]);

    const setFilters = useCallback((f: StoreFilters) => {
        setFiltersState(f);
    }, []);

    const loadMore = useCallback(
        () => fetchStores(loadedCountRef.current, true, filters),
        [fetchStores, filters],
    );

    return {
        stores,
        totalSize,
        isLoading,
        isLoadingMore,
        error,
        hasMore: totalSize > 0 && stores.length < totalSize,
        filters,
        setFilters,
        loadMore,
        hydrateFromServer,
    };
}
