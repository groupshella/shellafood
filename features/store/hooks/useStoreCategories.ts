"use client";

import { useCallback, useState } from "react";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { StoreCategory } from "@/features/store/types/store-categories.types";

interface UseStoreCategoriesReturn {
    categories: StoreCategory[] | null;
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

export function useStoreCategories(storeId: string | undefined): UseStoreCategoriesReturn {
    const [categories, setCategories] = useState<StoreCategory[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!storeId) {
            setCategories(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/store/categories/details?id=${storeId}`);
            const json = (await res.json()) as ApiResponse<StoreCategory[]>;
            setCategories(unwrap(json));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load store categories");
            setCategories(null);
        } finally {
            setIsLoading(false);
        }
    }, [storeId]);

    return { categories, isLoading, error, fetchCategories };
}
