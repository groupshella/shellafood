"use client";

import { useCallback, useState } from "react";
import SearchBar from "./SearchBar";
import RecentSearches from "./RecentSearches";
import PopularSearch from "./PopularSearch";
import PopularBrands from "./PopularBrands";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";

export default function SearchPage({ moduleId }: { moduleId: string | undefined }) {
    const [query, setQuery] = useState("");
    const { recentSearches, addSearch, clearRecent, isHydrated } = useRecentSearches();

    const handleSelect = useCallback(
        (term: string) => {
            setQuery(term);
        },
        [],
    );

    const handleSubmit = useCallback(
        (term: string) => {
            const trimmed = term.trim();
            if (!trimmed) return;
            setQuery(trimmed);
            addSearch(trimmed);
        },
        [addSearch],
    );

    return (
        <div className="min-h-screen  px-4 pb-8 pt-4" dir="rtl">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />

            <div className="mt-8 flex flex-col gap-8">
                {isHydrated ? (
                    <RecentSearches
                        searches={recentSearches}
                        activeQuery={query}
                        onSelect={handleSelect}
                        onClear={clearRecent}
                    />
                ) : null}

                <PopularSearch activeQuery={query} onSelect={handleSelect} />
                <PopularBrands moduleId={moduleId} onSelect={handleSelect} />
            </div>
        </div>
    );
}
