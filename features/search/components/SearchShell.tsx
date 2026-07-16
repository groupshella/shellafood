"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { SearchProvider, useSearchContext } from "./SearchContext";
import { SearchResultsClient } from "./sections/SearchResults/SearchResultsClient";

const DEFAULT_MODULE_ID = "3";

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background px-3 pb-10 pt-3 sm:max-w-2xl sm:px-4 sm:pb-12 sm:pt-4 md:max-w-3xl md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl 2xl:px-8";

const BACK_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11 sm:w-11";

function SearchShellInner({ children }: { children: React.ReactNode }) {
    const { query, setQuery, handleSubmit, hasSearched, isArabic } = useSearchContext();
    const BackIcon = isArabic ? ChevronRight : ChevronLeft;

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        handleSubmit(query);
    };

    return (
        <div
            className={SHELL_LAYOUT}
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="flex w-full min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-3">
                <Link
                    href="/home"
                    className={BACK_BTN}
                    aria-label={isArabic ? "العودة للرئيسية" : "Back to home"}
                >
                    <BackIcon className="h-5 w-5 text-muted sm:h-6 sm:w-6" aria-hidden />
                </Link>

                <form
                    onSubmit={onSubmit}
                    role="search"
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-card px-3 py-2.5 sm:gap-2.5 sm:px-4 sm:py-3 lg:px-5"
                >
                    <Search className="h-[18px] w-[18px] shrink-0 text-muted sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />

                    <input
                        type="search"
                        enterKeyHint="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={isArabic ? "البحث" : "Search"}
                        aria-label={isArabic ? "البحث" : "Search"}
                        className={[
                            "min-w-0 flex-1 bg-transparent text-start text-sm text-foreground",
                            "placeholder:text-muted",
                            "outline-none sm:text-[15px] lg:text-base",
                            "[&::-webkit-search-cancel-button]:appearance-none",
                            "[&::-webkit-search-decoration]:appearance-none",
                        ].join(" ")}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label={isArabic ? "مسح البحث" : "Clear search"}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border text-muted transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-8 sm:w-8"
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
    isArabic,
}: {
    children: React.ReactNode;
    moduleId?: string;
    isArabic: boolean;
}) {
    return (
        <SearchProvider moduleId={moduleId} isArabic={isArabic}>
            <SearchShellInner>{children}</SearchShellInner>
        </SearchProvider>
    );
}
