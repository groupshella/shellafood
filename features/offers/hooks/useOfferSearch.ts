"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export function useOfferSearch(offerId: string, moduleId = "3"): UseOfferSearchReturn {
    const [query, setQueryRaw] = useState("");
    const [results, setResults] = useState<OfferItem[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback(
        (q: string) => {
            abortRef.current?.abort();
            if (timerRef.current) clearTimeout(timerRef.current);

            if (!q.trim()) {
                setResults(null);
                setTotal(null);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            timerRef.current = setTimeout(async () => {
                const controller = new AbortController();
                abortRef.current = controller;

                try {
                    const res = await fetch(
                        `/api/offers/${offerId}/search?query=${encodeURIComponent(q)}&offset=1&limit=50&module_id=${moduleId}`,
                        { signal: controller.signal }
                    );
                    const json = (await res.json()) as ApiResponse<OfferItemsResult>;
                    const data = unwrap(json);
                    setResults(data.items);
                    setTotal(data.total);
                } catch (err) {
                    if ((err as Error).name === "AbortError") return;
                    setError("حدث خطأ أثناء البحث");
                    setResults([]);
                    setTotal(0);
                } finally {
                    if (!controller.signal.aborted) setLoading(false);
                }
            }, 300);
        },
        [offerId, moduleId]
    );

    const setQuery = useCallback(
        (q: string) => {
            setQueryRaw(q);
            doSearch(q);
        },
        [doSearch]
    );

    const clearSearch = useCallback(() => {
        abortRef.current?.abort();
        if (timerRef.current) clearTimeout(timerRef.current);
        setQueryRaw("");
        setResults(null);
        setTotal(null);
        setLoading(false);
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { query, setQuery, results, total, loading, error, clearSearch };
}
