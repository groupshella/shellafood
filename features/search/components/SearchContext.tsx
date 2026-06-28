"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";
import { useSearch } from "@/features/search/hooks/useSearch";
import { SearchResults } from "@/features/search/types/search.types";

interface SearchContextValue {
    query: string;
    setQuery: (value: string) => void;
    handleSelect: (term: string) => void;
    handleSubmit: (term: string) => void;
    recentSearches: string[];
    clearRecent: () => void;
    isHydrated: boolean;
    results: SearchResults | null;
    isSearching: boolean;
    error: string | null;
    hasSearched: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchContext() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearchContext must be used within SearchShell");
    return ctx;
}

export function SearchProvider({
    children,
    moduleId,
}: {
    children: React.ReactNode;
    moduleId: string;
}) {
    const [query, setQuery] = useState("");
    const { recentSearches, addSearch, clearRecent, isHydrated } = useRecentSearches();
    const { results, isSearching, error, hasSearched, search, resetSearch } = useSearch(moduleId);

    const handleSubmit = useCallback(
        (term: string) => {
            const trimmed = term.trim();
            if (!trimmed) {
                resetSearch();
                return;
            }

            setQuery(trimmed);
            addSearch(trimmed);
            void search(trimmed);
        },
        [addSearch, resetSearch, search],
    );

    const handleSelect = useCallback(
        (term: string) => {
            handleSubmit(term);
        },
        [handleSubmit],
    );

    const handleQueryChange = useCallback(
        (value: string) => {
            setQuery(value);
            if (!value.trim()) {
                resetSearch();
            }
        },
        [resetSearch],
    );

    return (
        <SearchContext.Provider
            value={{
                query,
                setQuery: handleQueryChange,
                handleSelect,
                handleSubmit,
                recentSearches,
                clearRecent,
                isHydrated,
                results,
                isSearching,
                error,
                hasSearched,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
