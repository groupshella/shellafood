"use client";

import { SearchBar } from "./SearchBar";
import { SearchProvider, useSearchContext } from "./SearchContext";

function SearchShellInner({ children }: { children: React.ReactNode }) {
    const { query, setQuery, handleSubmit } = useSearchContext();

    return (
        <div className="min-h-screen px-4 pb-8 pt-4" dir="rtl">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
            {children}
        </div>
    );
}

export function SearchShell({ children }: { children: React.ReactNode }) {
    return (
        <SearchProvider>
            <SearchShellInner>{children}</SearchShellInner>
        </SearchProvider>
    );
}
