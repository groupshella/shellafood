"use client";

import { SearchBar } from "./SearchBar";
import { SearchProvider, useSearchContext } from "./SearchContext";
import { SearchResultsClient } from "./sections/SearchResults/SearchResultsClient";

const DEFAULT_MODULE_ID = "3";

function SearchShellInner({ children }: { children: React.ReactNode }) {
    const { query, setQuery, handleSubmit, hasSearched } = useSearchContext();

    return (
        <div className="min-h-screen px-4 pb-8 pt-4" dir="rtl">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
            {hasSearched ? <SearchResultsClient /> : children}
        </div>
    );
}

export function SearchShell({
    children,
    moduleId = DEFAULT_MODULE_ID,
}: {
    children: React.ReactNode;
    moduleId?: string;
}) {
    return (
        <SearchProvider moduleId={moduleId}>
            <SearchShellInner>{children}</SearchShellInner>
        </SearchProvider>
    );
}
