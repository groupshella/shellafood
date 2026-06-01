"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ENDPOINT_API_PATH } from "../../../home/constants/home.constants";
import { Store, Stores } from "@/features/(modules)/stores/types/stores.type";

interface UseStoresOptions {
    endpoint: keyof typeof ENDPOINT_API_PATH;
    limit?: number;
}
interface UseStoresReturn {
    stores: Store[];
    loading: boolean;
    error: string | null;
}
export function useStores({
    endpoint,
}: UseStoresOptions): UseStoresReturn {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStores = useCallback(
        async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(ENDPOINT_API_PATH[endpoint]);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: Stores = await res.json();
                setStores(data.stores as Store[]);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        },
        [endpoint]
    );

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    return {
        stores,
        loading,
        error,
    };
}