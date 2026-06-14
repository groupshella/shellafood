"use client";

import { useCallback, useEffect, useState } from "react";
import {
    GetPopularSearchResponse,
    PopularSearchItem,
} from "@/features/search/types/popular-search.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UsePopularSearchReturn {
    items: PopularSearchItem[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function usePopularSearch(): UsePopularSearchReturn {
    const [items, setItems] = useState<PopularSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPopularSearch = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/search/popular-search");
            const json = (await res.json()) as ApiResponse<GetPopularSearchResponse>;
            const data = unwrap(json);
            setItems(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load popular search");
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPopularSearch();
    }, [fetchPopularSearch]);

    return { items, isLoading, error, refetch: fetchPopularSearch };
}
