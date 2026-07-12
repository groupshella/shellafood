"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    SearchItemsResponse,
    SearchProduct,
    SearchResults,
    SearchStoresResponse,
} from "@/features/search/types/search.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { useLanguage } from "@/features/language/useLanguage";

const ITEMS_PER_PAGE = 30;

async function fetchSearchEndpoint<T>(
    path: string,
    params: URLSearchParams,
    signal?: AbortSignal,
): Promise<T> {
    const res = await fetch(`${path}?${params}`, { signal });
    const json = (await res.json()) as ApiResponse<T>;
    return unwrap(json);
}

export function useSearch(moduleId: string) {
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemSize, setTotalItemSize] = useState(0);
    const accumulatedProducts = useRef<SearchProduct[]>([]);
    const currentQuery = useRef<string>("");
    const moduleIdRef = useRef(moduleId);
    const abortRef = useRef<AbortController | null>(null);
    const { isArabic } = useLanguage();
    useEffect(() => {
        moduleIdRef.current = moduleId;
    }, [moduleId]);

    const search = useCallback(async (query: string, nextModuleId?: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const activeModuleId = nextModuleId ?? moduleIdRef.current;
        if (nextModuleId) moduleIdRef.current = nextModuleId;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setIsSearching(true);
        setError(null);
        setHasSearched(true);

        currentQuery.current = trimmed;
        accumulatedProducts.current = [];
        setCurrentPage(1);
        setTotalItemSize(0);

        try {
            const params = new URLSearchParams({
                name: trimmed,
                module_id: activeModuleId,
                offset: "1",
                limit: String(ITEMS_PER_PAGE),
                "Accept-Language": isArabic ? "ar" : "en",
                "X-Localization": isArabic ? "ar" : "en",
            });

            const [itemsData, storesData] = await Promise.all([
                fetchSearchEndpoint<SearchItemsResponse>(
                    "/api/search/items",
                    params,
                    controller.signal,
                ),
                fetchSearchEndpoint<SearchStoresResponse>(
                    "/api/search/stores",
                    new URLSearchParams({ name: trimmed, module_id: activeModuleId }),
                    controller.signal,
                ),
            ]);

            accumulatedProducts.current = itemsData.products ?? [];
            setTotalItemSize(itemsData.total_size ?? 0);
            setCurrentPage(1);

            setResults({
                items: {
                    ...itemsData,
                    products: accumulatedProducts.current,
                },
                stores: storesData,
            });
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setError(err instanceof Error ? err.message : "Failed to search");
            setResults(null);
        } finally {
            if (!controller.signal.aborted) {
                setIsSearching(false);
            }
        }
    }, []);

    const loadMore = useCallback(async () => {
        if (!currentQuery.current || isLoadingMore) return;

        const nextPage = currentPage + 1;

        setIsLoadingMore(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                name: currentQuery.current,
                module_id: moduleIdRef.current,
                offset: String(nextPage),
                limit: String(ITEMS_PER_PAGE),
                "Accept-Language": isArabic ? "ar" : "en",
                "X-Localization": isArabic ? "ar" : "en",
            });

            const itemsData = await fetchSearchEndpoint<SearchItemsResponse>(
                "/api/search/items",
                params,
            );
            const newProducts = itemsData.products ?? [];
            accumulatedProducts.current = [...accumulatedProducts.current, ...newProducts];
            setCurrentPage(nextPage);
            setTotalItemSize(itemsData.total_size ?? totalItemSize);
            setResults((prev) =>
                prev
                    ? {
                        ...prev,
                        items: {
                            ...prev.items,
                            products: accumulatedProducts.current,
                        },
                    }
                    : prev,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more");
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, isLoadingMore, totalItemSize]);

    const hasMore = accumulatedProducts.current.length < totalItemSize;

    const resetSearch = useCallback(() => {
        abortRef.current?.abort();
        setResults(null);
        setError(null);
        setHasSearched(false);
        setIsSearching(false);
        setIsLoadingMore(false);
        setCurrentPage(1);
        setTotalItemSize(0);
        accumulatedProducts.current = [];
        currentQuery.current = "";
    }, []);

    return {
        results,
        isSearching,
        isLoadingMore,
        error,
        hasSearched,
        hasMore,
        search,
        loadMore,
        resetSearch,
    };
}
