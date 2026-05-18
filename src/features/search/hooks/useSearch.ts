"use client";

import { useState, useCallback, useRef } from "react";
import { searchStores } from "../api/search.api";
import type { ApiStore, StoreType, SearchContext } from "../types/search.types";

export interface UseSearchResult {
	stores: ApiStore[];
	totalSize: number;
	isSearching: boolean;
	error: string | null;
	search: (name: string, type?: StoreType, offset?: number) => Promise<void>;
	reset: () => void;
}

const LIMIT = 10;

export function useSearch(ctx: SearchContext): UseSearchResult {
	const [stores, setStores] = useState<ApiStore[]>([]);
	const [totalSize, setTotalSize] = useState(0);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Abort previous in-flight request when a new one starts
	const abortRef = useRef<AbortController | null>(null);

	const search = useCallback(
		async (name: string, type: StoreType = "all", offset: number = 1) => {
			const trimmed = name.trim();
			if (!trimmed) { setStores([]); setTotalSize(0); return; }

			// Cancel previous request
			abortRef.current?.abort();
			abortRef.current = new AbortController();

			setIsSearching(true);
			setError(null);

			const result = await searchStores({ name: trimmed, type, limit: LIMIT, offset: offset }, ctx);

			// Ignore stale responses after abort
			if (abortRef.current?.signal.aborted) return;

			if (result.success) {
				// Append on pagination, replace on fresh search
				setStores(offset === 1 ? result.data.stores : (prev: ApiStore[]) => [...prev, ...result.data.stores]);
				setTotalSize(result.data.total_size);
			} else {
				setError(result.error);
			}

			setIsSearching(false);
		},
		[ctx],
	);

	const reset = useCallback(() => {
		abortRef.current?.abort();
		setStores([]);
		setTotalSize(0);
		setError(null);
		setIsSearching(false);
	}, []);

	return { stores, totalSize, isSearching, error, search, reset };
}