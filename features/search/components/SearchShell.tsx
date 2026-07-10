"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { SearchProvider, useSearchContext } from "./SearchContext";
import { SearchResultsClient } from "./sections/SearchResults/SearchResultsClient";

const DEFAULT_MODULE_ID = "3";

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-white px-3 pb-10 pt-3 dark:bg-gray-950 sm:max-w-2xl sm:px-4 sm:pb-12 sm:pt-4 md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl 2xl:px-8";

const BACK_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 dark:active:bg-gray-800 sm:h-11 sm:w-11";

function SearchShellInner({ children }: { children: React.ReactNode }) {
    const { query, setQuery, handleSubmit, hasSearched } = useSearchContext();

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        handleSubmit(query);
    };

    return (
        <div className={SHELL_LAYOUT} dir="rtl">
            <div className="flex w-full min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-3" dir="rtl">
                <Link href="/home" className={BACK_BTN} aria-label="العودة للرئيسية">
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 sm:h-6 sm:w-6" aria-hidden />
                </Link>

                <form
                    onSubmit={onSubmit}
                    role="search"
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-gray-100 px-3 py-2.5 dark:bg-gray-800 sm:gap-2.5 sm:px-4 sm:py-3 lg:px-5"
                >
                    <Search className="h-[18px] w-[18px] shrink-0 text-gray-400 dark:text-gray-500 sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />

                    <input
                        type="search"
                        enterKeyHint="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="البحث"
                        aria-label="البحث"
                        className={[
                            "min-w-0 flex-1 bg-transparent text-start text-sm text-gray-900 dark:text-gray-100",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            "outline-none sm:text-[15px] lg:text-base",
                            "[&::-webkit-search-cancel-button]:appearance-none",
                            "[&::-webkit-search-decoration]:appearance-none",
                        ].join(" ")}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="مسح البحث"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600 transition-colors active:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-600 dark:text-gray-300 sm:h-8 sm:w-8"
                        >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                        </button>
                    )}
                </form>
            </div>
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
