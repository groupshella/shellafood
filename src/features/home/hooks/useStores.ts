"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ApiStore, StoreListResponse, StoreQueryParams } from "../types/store.types";

type StoreEndpoint =
    | "all"
    | "latest"
    | "popular"
    | "recommended"
    | "discounted"
    | "top-rated"
    | "top-offer";

/** Next.js route per list type (each has its own `route.ts` + proxy config) */
const ENDPOINT_API_PATH: Record<StoreEndpoint, string> = {
    all: "/api/stores/all",
    latest: "/api/stores/latest",
    popular: "/api/stores/popular",
    recommended: "/api/stores/recommended",
    discounted: "/api/stores/discounted",
    "top-rated": "/api/stores/top-rated",
    "top-offer": "/api/stores/top-offer",
};

interface UseStoresOptions extends StoreQueryParams {
    endpoint: StoreEndpoint;
    enabled?: boolean;
}

interface UseStoresReturn {
    stores: ApiStore[];
    totalSize: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
    loadMore: () => void;
    refresh: () => void;
    setPage: (p: number) => void;
}

const PAGE_SIZE = 8;

export function useStores({
    endpoint,
    limit = PAGE_SIZE,
    offset = 0,
    type = "all",
    sort_by,
    featured,
    filter,
    enabled = true,
}: UseStoresOptions): UseStoresReturn {
    const [stores, setStores] = useState<ApiStore[]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [page, setPage] = useState(0); // offset index
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchStores = useCallback(
        async (pageIndex: number, append = false) => {
            if (!enabled) return;

            // Cancel any in-flight request
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            if (pageIndex === 0) setIsLoading(true);
            else setIsLoadingMore(true);
            setError(null);

            const params = new URLSearchParams({
                limit: String(limit),
                offset: String(pageIndex),
                type,
            });
            if (sort_by) params.set("sort_by", sort_by);
            if (featured !== undefined) params.set("featured", featured ? "1" : "0");
            if (filter) params.set("filter", filter);

            const apiPath = ENDPOINT_API_PATH[endpoint];

            try {
                const res = await fetch(`${apiPath}?${params.toString()}`, {
                    signal: abortRef.current.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: StoreListResponse = await res.json();
                setTotalSize(data.total_size ?? 0);
                setStores((prev) => (append ? [...prev, ...(data.stores ?? [])] : data.stores ?? []));
            } catch (err: unknown) {
                console.log("err", err);
                if ((err as Error).name === "AbortError") return;
                setError("عذراً، حدث خطأ ما أثناء تحميل المتاجر. يرجى المحاولة مرة أخرى.");
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [endpoint, limit, type, sort_by, featured, filter, enabled]
    );

    useEffect(() => {
        setPage(0);
        setStores([]);
        fetchStores(0, false);
    }, [fetchStores]);

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStores(nextPage, true);
    }, [page, fetchStores]);

    const refresh = useCallback(() => {
        setPage(0);
        setStores([]);
        fetchStores(0, false);
    }, [fetchStores]);

    const hasMore = stores.length < totalSize;

    return {
        stores,
        totalSize,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        page,
        loadMore,
        refresh,
        setPage,
    };
}