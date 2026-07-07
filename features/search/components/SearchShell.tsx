"use client";

import { SearchBar } from "./SearchBar";
import { SearchProvider, useSearchContext } from "./SearchContext";
import { SearchResultsClient } from "./sections/SearchResults/SearchResultsClient";

const DEFAULT_MODULE_ID = "3";

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-white px-3 pb-10 pt-3 dark:bg-gray-950 sm:max-w-2xl sm:px-4 sm:pb-12 sm:pt-4 md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl 2xl:px-8";

function SearchShellInner({ children }: { children: React.ReactNode }) {
    const { query, setQuery, handleSubmit, hasSearched } = useSearchContext();

    return (
        <div className={SHELL_LAYOUT} dir="rtl">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
            <div className="mt-5 sm:mt-6 lg:mt-8">
                {hasSearched ? <SearchResultsClient /> : children}
            </div>
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
