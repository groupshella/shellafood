"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
    isLoadingMore: boolean;
    hasMore: boolean;
    loadMore: () => void;
    error: string | null;
    hasSearched: boolean;
    moduleId: string;
    setModuleId: (moduleId: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchContext() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearchContext must be used within SearchShell");
    return ctx;
}

export function SearchProvider({
    children,
    moduleId: initialModuleId,
}: {
    children: React.ReactNode;
    moduleId: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [moduleId, setModuleIdState] = useState(initialModuleId);
    const { recentSearches, addSearch, clearRecent, isHydrated } = useRecentSearches();
    const { results, isSearching, isLoadingMore, hasMore, error, hasSearched, search, loadMore, resetSearch } =
        useSearch(moduleId);

    const queryRef = useRef(query);
    const hasSearchedRef = useRef(hasSearched);
    queryRef.current = query;
    hasSearchedRef.current = hasSearched;

    useEffect(() => {
        setModuleIdState(initialModuleId);
    }, [initialModuleId]);

    const setModuleId = useCallback(
        (nextModuleId: string) => {
            if (nextModuleId === moduleId) return;

            setModuleIdState(nextModuleId);
            router.replace(`${pathname}?module_id=${encodeURIComponent(nextModuleId)}`, {
                scroll: false,
            });

            const activeQuery = queryRef.current.trim();
            if (hasSearchedRef.current && activeQuery) {
                void search(activeQuery, nextModuleId);
            }
        },
        [moduleId, pathname, router, search],
    );

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
                isLoadingMore,
                hasMore,
                loadMore,
                error,
                hasSearched,
                moduleId,
                setModuleId,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
