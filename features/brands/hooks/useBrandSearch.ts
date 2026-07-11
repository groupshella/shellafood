"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";
import { mapBrandItemsResponse } from "../lib/normalize-brand-item";
import type { BrandItem, GetBrandItemsApiResponse } from "../types/brands.types";

interface UseBrandSearchReturn {
    query: string;
    setQuery: (q: string) => void;
    submitSearch: () => void;
    results: BrandItem[] | null;
    total: number | null;
    loading: boolean;
    error: string | null;
    clearSearch: () => void;
}

export function useBrandSearch(brandId: string): UseBrandSearchReturn {
    const [query, setQueryRaw] = useState("");
    const [results, setResults] = useState<BrandItem[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const runSearch = useCallback(async (q: string) => {
        const trimmed = q.trim();
        if (!trimmed) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/brands/${brandId}/search?query=${encodeURIComponent(trimmed)}&offset=0&limit=50`,
                { signal: controller.signal },
            );
            const json = (await res.json()) as ApiResponse<GetBrandItemsApiResponse>;
            const { items, total: count } = mapBrandItemsResponse(unwrap(json));
            setResults(items);
            setTotal(count);
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setError("حدث خطأ أثناء البحث");
            setResults([]);
            setTotal(0);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [brandId]);

    const setQuery = useCallback((q: string) => {
        setQueryRaw(q);
        if (!q.trim()) {
            abortRef.current?.abort();
            setResults(null);
            setTotal(null);
            setLoading(false);
            setError(null);
        }
    }, []);

    const submitSearch = useCallback(() => {
        void runSearch(query);
    }, [runSearch, query]);

    const clearSearch = useCallback(() => {
        abortRef.current?.abort();
        setQueryRaw("");
        setResults(null);
        setTotal(null);
        setLoading(false);
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        };
    }, []);

    return { query, setQuery, submitSearch, results, total, loading, error, clearSearch };
}
