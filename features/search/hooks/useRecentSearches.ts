"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "shellafood:recent-searches";
const MAX_RECENT = 12;

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setRecentSearches(JSON.parse(stored) as string[]);
        } catch {
            setRecentSearches([]);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    const addSearch = useCallback((term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;

        setRecentSearches((prev) => {
            const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const clearRecent = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { recentSearches, addSearch, clearRecent, isHydrated };
}
