"use client";

import { useCallback, useEffect, useState } from "react";
import {
    DiscountedStore,
    GetDiscountedStoresResponse,
} from "@/features/home/types/discounted-stores.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseDiscountedStoresReturn {
    stores: DiscountedStore[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDiscountedStores(): UseDiscountedStoresReturn {
    const [stores, setStores] = useState<DiscountedStore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/home/discounted-stores");
            const json = (await res.json()) as ApiResponse<GetDiscountedStoresResponse>;
            const data = unwrap(json);
            setStores(data.stores ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load discounted stores");
            setStores([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    return { stores, isLoading, error, refetch: fetchStores };
}
