"use client";

import { useCallback, useRef, useState } from "react";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";
import { mapBrandItemsResponse } from "../lib/normalize-brand-item";
import type {
    BrandItem,
    FilterState,
    GetBrandItemsApiResponse,
} from "../types/brands.types";
import { EMPTY_FILTER } from "../types/brands.types";

interface UseBrandFilterReturn {
    applied: FilterState | null;
    results: BrandItem[] | null;
    total: number | null;
    loading: boolean;
    error: string | null;
    applyFilters: (f: FilterState) => Promise<void>;
    clearFilters: () => void;
}

function buildFilterUrl(brandId: string, filters: FilterState): string {
    const params = new URLSearchParams({ page: "1", limit: "50" });
    if (filters.priceRange?.min !== undefined) {
        params.set("min_price", String(filters.priceRange.min));
    }
    if (filters.priceRange?.max !== undefined) {
        params.set("max_price", String(filters.priceRange.max));
    }
    return `/api/brands/${brandId}/filter?${params.toString()}`;
}

export function useBrandFilter(brandId: string): UseBrandFilterReturn {
    const [applied, setApplied] = useState<FilterState | null>(null);
    const [results, setResults] = useState<BrandItem[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);

    const applyFilters = useCallback(
        async (f: FilterState) => {
            if (!f.priceRange) {
                setApplied(null);
                setResults(null);
                setTotal(null);
                setError(null);
                return;
            }

            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError(null);

            try {
                const res = await fetch(buildFilterUrl(brandId, f), {
                    signal: controller.signal,
                });
                const json = (await res.json()) as ApiResponse<GetBrandItemsApiResponse>;
                const { items, total: count } = mapBrandItemsResponse(unwrap(json));
                setResults(items);
                setTotal(count);
                setApplied(f);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError("حدث خطأ أثناء تطبيق الفلتر");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        },
        [brandId]
    );

    const clearFilters = useCallback(() => {
        abortRef.current?.abort();
        setApplied(null);
        setResults(null);
        setTotal(null);
        setLoading(false);
        setError(null);
    }, []);

    return {
        applied,
        results,
        total,
        loading,
        error,
        applyFilters,
        clearFilters,
    };
}
