"use client";

import { useCallback, useEffect, useState } from "react";
import { StoreDetails } from "@/features/store/types/store-details.types";
import { StoreCategory } from "@/features/store/types/store-categories.types";
import { useStoreCategories } from "@/features/store/hooks/useStoreCategories";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseStoreDetailsReturn {
    store: StoreDetails | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    fetchCategoires: () => Promise<void>;
    categories: StoreCategory[] | null;
}

export function useStoreDetails(storeId: string | undefined): UseStoreDetailsReturn {
    const [store, setStore] = useState<StoreDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { categories, fetchCategories } = useStoreCategories(storeId);

    const fetchStore = useCallback(async () => {
        if (!storeId) {
            setStore(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/store/details?id=${storeId}`);
            const json = (await res.json()) as ApiResponse<StoreDetails>;
            setStore(unwrap(json));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load store");
            setStore(null);
        } finally {
            setIsLoading(false);
        }
    }, [storeId]);

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    return {
        store,
        isLoading,
        error,
        refetch: fetchStore,
        fetchCategoires: fetchCategories,
        categories,
    };
}
