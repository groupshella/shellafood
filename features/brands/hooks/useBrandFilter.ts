"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";
import { mapBrandItemsResponse } from "../lib/normalize-brand-item";
import type {
    BrandItem,
    FilterState,
    GetBrandItemsApiResponse,
} from "../types/brands.types";

interface UseBrandFilterReturn {
    applied: FilterState | null;
    results: BrandItem[] | null;
    total: number | null;
    loading: boolean;
    error: string | null;
    applyFilters: (f: FilterState) => Promise<void>;
    clearFilters: () => void;
}

function buildFilterUrl(
    brandId: string,
    filters: FilterState,
    lang: "ar" | "en"
): string {
    const params = new URLSearchParams({ page: "1", limit: "50", lang });
    if (filters.priceRange?.min !== undefined) {
        params.set("min_price", String(filters.priceRange.min));
    }
    if (filters.priceRange?.max !== undefined) {
        params.set("max_price", String(filters.priceRange.max));
    }
    return `/api/brands/${brandId}/filter?${params.toString()}`;
}

export function useBrandFilter(
    brandId: string,
    lang: "ar" | "en",
    isArabic: boolean
): UseBrandFilterReturn {
    const [applied, setApplied] = useState<FilterState | null>(null);
    const [results, setResults] = useState<BrandItem[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const langRef = useRef(lang);
    const isArabicRef = useRef(isArabic);

    useEffect(() => {
        langRef.current = lang;
        isArabicRef.current = isArabic;
    }, [lang, isArabic]);

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
                const res = await fetch(buildFilterUrl(brandId, f, langRef.current), {
                    signal: controller.signal,
                });
                const json = (await res.json()) as ApiResponse<GetBrandItemsApiResponse>;
                const { items, total: count } = mapBrandItemsResponse(unwrap(json));
                setResults(items);
                setTotal(count);
                setApplied(f);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(
                    isArabicRef.current
                        ? "حدث خطأ أثناء تطبيق الفلتر"
                        : "Something went wrong while applying filters"
                );
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
