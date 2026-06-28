"use client";

import { useCallback, useRef, useState } from "react";
import {
    SearchItemsResponse,
    SearchResults,
    SearchStoresResponse,
} from "@/features/search/types/search.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

function buildParams(name: string, moduleId: string): URLSearchParams {
    return new URLSearchParams({ name, module_id: moduleId });
}

async function fetchSearchEndpoint<T>(path: string, params: URLSearchParams, signal?: AbortSignal) {
    const res = await fetch(`${path}?${params}`, { signal });
    const json = (await res.json()) as ApiResponse<T>;
    return unwrap(json);
}

export function useSearch(moduleId: string) {
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const search = useCallback(
        async (query: string) => {
            const trimmed = query.trim();
            if (!trimmed) return;

            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setIsSearching(true);
            setError(null);
            setHasSearched(true);

            try {
                const params = buildParams(trimmed, moduleId);
                const [items, stores] = await Promise.all([
                    fetchSearchEndpoint<SearchItemsResponse>(
                        "/api/search/items",
                        params,
                        controller.signal,
                    ),
                    fetchSearchEndpoint<SearchStoresResponse>(
                        "/api/search/stores",
                        params,
                        controller.signal,
                    ),
                ]);

                setResults({ items, stores });
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Failed to search");
                setResults(null);
            } finally {
                if (!controller.signal.aborted) {
                    setIsSearching(false);
                }
            }
        },
        [moduleId],
    );

    const resetSearch = useCallback(() => {
        abortRef.current?.abort();
        setResults(null);
        setError(null);
        setHasSearched(false);
        setIsSearching(false);
    }, []);

    return { results, isSearching, error, hasSearched, search, resetSearch };
}
