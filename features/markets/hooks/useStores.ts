"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    GetStoresResponse,
    StoreFilters,
    DEFAULT_FILTERS,
} from "@/features/markets/types/stores.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

const PAGE_SIZE = 30;

function buildParams(
    moduleId: string,
    filters: StoreFilters,
    limit: number,
    offset: number,
): URLSearchParams {
    const params = new URLSearchParams({
        module_id: moduleId,
        limit: String(limit),
        offset: String(offset),
    });

    if (filters.categoryId !== null) params.set("category_id", String(filters.categoryId));
    if (filters.hasOffer) params.set("has_offer", "1");
    if (filters.freeDelivery) params.set("free_delivery", "1");
    if (filters.topRated) params.set("top_rated", "1");
    if (filters.openNow) params.set("open_now", "1");
    if (filters.under30Min) params.set("under_30_min", "1");

    return params;
}

export function useStores(moduleId: string) {
    const [stores, setStores] = useState<GetStoresResponse["stores"]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<StoreFilters>(DEFAULT_FILTERS);
    const loadedCountRef = useRef(0);

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
                const params = buildParams(moduleId, activeFilters, PAGE_SIZE, nextOffset);
                const res = await fetch(`/api/module/stores?${params}`, { signal });
                const json = (await res.json()) as ApiResponse<GetStoresResponse>;
                const data = unwrap(json);
                console.log(data);
                setStores((prev) => {
                    const next = append
                        ? [...prev, ...(data.stores ?? [])]
                        : (data.stores ?? []);
                    loadedCountRef.current += 1;
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
    useEffect(() => {
        const controller = new AbortController();
        loadedCountRef.current = 0;
        fetchStores(0, false, filters, controller.signal);
        return () => controller.abort();
    }, [fetchStores, filters]);

    const setFilters = useCallback((f: StoreFilters) => {
        setFiltersState(f);
    }, []);
    console.log(loadedCountRef.current + PAGE_SIZE);
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
    };
}
