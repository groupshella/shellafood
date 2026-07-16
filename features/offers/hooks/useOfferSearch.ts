"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";
import type { OfferItem, OfferItemsResult } from "../types/offer.types";

interface UseOfferSearchReturn {
    query: string;
    setQuery: (q: string) => void;
    results: OfferItem[] | null;
    total: number | null;
    loading: boolean;
    error: string | null;
    clearSearch: () => void;
}

export function useOfferSearch(
    offerId: string,
    moduleId = "3",
    lang: "ar" | "en" = "ar",
    isArabic = true
): UseOfferSearchReturn {
    const [query, setQueryRaw] = useState("");
    const [results, setResults] = useState<OfferItem[] | null>(null);
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

    const runSearch = useDebouncedCallback(async (q: string) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch(
                `/api/offers/${offerId}/search?query=${encodeURIComponent(q)}&offset=1&limit=50&module_id=${moduleId}&lang=${langRef.current}`,
                { signal: controller.signal },
            );
            const json = (await res.json()) as ApiResponse<OfferItemsResult>;
            const data = unwrap(json);
            setResults(data.items);
            setTotal(data.total);
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setError(
                isArabicRef.current
                    ? "حدث خطأ أثناء البحث"
                    : "Something went wrong while searching"
            );
            setResults([]);
            setTotal(0);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, 300);

    const setQuery = useCallback(
        (q: string) => {
            setQueryRaw(q);

            if (!q.trim()) {
                runSearch.cancel();
                abortRef.current?.abort();
                setResults(null);
                setTotal(null);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            void runSearch(q);
        },
        [runSearch],
    );

    const clearSearch = useCallback(() => {
        runSearch.cancel();
        abortRef.current?.abort();
        setQueryRaw("");
        setResults(null);
        setTotal(null);
        setLoading(false);
        setError(null);
    }, [runSearch]);

    useEffect(() => {
        return () => {
            runSearch.cancel();
            abortRef.current?.abort();
        };
    }, [runSearch]);

    return { query, setQuery, results, total, loading, error, clearSearch };
}
