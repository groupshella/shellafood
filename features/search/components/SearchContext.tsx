"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";

interface SearchContextValue {
    query: string;
    setQuery: (value: string) => void;
    handleSelect: (term: string) => void;
    handleSubmit: (term: string) => void;
    recentSearches: string[];
    clearRecent: () => void;
    isHydrated: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchContext() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearchContext must be used within SearchShell");
    return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [query, setQuery] = useState("");
    const { recentSearches, addSearch, clearRecent, isHydrated } = useRecentSearches();

    const handleSelect = useCallback((term: string) => {
        setQuery(term);
    }, []);

    const handleSubmit = useCallback(
        (term: string) => {
            const trimmed = term.trim();
            if (!trimmed) return;
            setQuery(trimmed);
            addSearch(trimmed);
        },
        [addSearch]
    );

    return (
        <SearchContext.Provider
            value={{ query, setQuery, handleSelect, handleSubmit, recentSearches, clearRecent, isHydrated }}
        >
            {children}
        </SearchContext.Provider>
    );
}
