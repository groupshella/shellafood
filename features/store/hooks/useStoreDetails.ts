"use client";

import { useCallback, useEffect, useState } from "react";
import { StoreDetails } from "@/features/store/types/store-details.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseStoreDetailsReturn {
    store: StoreDetails | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useStoreDetails(
    storeId: string | undefined,
    moduleId?: string,
): UseStoreDetailsReturn {
    const [store, setStore] = useState<StoreDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStore = useCallback(async () => {
        if (!storeId) {
            setStore(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/store?id=${storeId}&moduleId=${moduleId}`,
            );
            const json = (await res.json()) as ApiResponse<StoreDetails>;
            setStore(unwrap(json));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load store");
            setStore(null);
        } finally {
            setIsLoading(false);
        }
    }, [storeId, moduleId]);

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    return { store, isLoading, error, refetch: fetchStore };
}
