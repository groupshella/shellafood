"use client";

import { useCallback, useEffect, useState } from "react";
import { GetStoresResponse, Store } from "@/features/module/types/stores.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

const PAGE_SIZE = 12;

interface UseStoresReturn {
    stores: Store[];
    totalSize: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    refetch: () => void;
    loadMore: () => void;
}

export function useStores(moduleId: string | undefined): UseStoresReturn {
    const [stores, setStores] = useState<Store[]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStores = useCallback(
        async (nextOffset: number, append: boolean, signal?: AbortSignal) => {
            if (!moduleId) {
                setStores([]);
                setTotalSize(0);
                setIsLoading(false);
                return;
            }

            append ? setIsLoadingMore(true) : setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    moduleId,
                    limit: String(PAGE_SIZE),
                    offset: String(nextOffset),
                });
                const res = await fetch(`/api/module/stores?${params}`, { signal });
                const json = (await res.json()) as ApiResponse<GetStoresResponse>;
                const data = unwrap(json);

                setStores((prev) =>
                    append ? [...prev, ...(data.stores ?? [])] : (data.stores ?? []),
                );
                setTotalSize(data.total_size ?? 0);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Failed to load stores");
                if (!append) setStores([]);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [moduleId],
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchStores(0, false, controller.signal);
        return () => controller.abort();
    }, [fetchStores]);

    const refetch = useCallback(() => fetchStores(0, false), [fetchStores]);
    const loadMore = useCallback(
        () => fetchStores(stores.length, true),
        [fetchStores, stores.length],
    );

    return {
        stores,
        totalSize,
        isLoading,
        isLoadingMore,
        error,
        hasMore: totalSize > 0 && stores.length < totalSize,
        refetch,
        loadMore,
    };
}