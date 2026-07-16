"use client";

import { Trash2 } from "lucide-react";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchChip } from "@/features/search/components/shared/SearchChip";

const SECTION_HEADING =
    "text-sm font-bold text-foreground sm:text-base lg:text-lg";

export function RecentSearchesClient() {
    const { query, handleSubmit, recentSearches, clearRecent, isHydrated, isArabic } =
        useSearchContext();

    if (!isHydrated || recentSearches.length === 0) return null;

    return (
        <section
            aria-label={isArabic ? "عمليات البحث الأخيرة" : "Recent searches"}
            className="space-y-3 sm:space-y-4"
        >
            <div className="flex items-center justify-between gap-3">
                <h2 className={SECTION_HEADING}>
                    {isArabic ? "عمليات البحث الأخيرة" : "Recent searches"}
                </h2>
                <button
                    type="button"
                    onClick={clearRecent}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors active:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-10 sm:w-10"
                    aria-label={
                        isArabic ? "مسح عمليات البحث الأخيرة" : "Clear recent searches"
                    }
                >
                    <Trash2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} aria-hidden />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5 lg:gap-3">
                {recentSearches.map((term) => (
                    <SearchChip
                        key={term}
                        label={term}
                        isActive={query === term}
                        onClick={() => handleSubmit(term)}
                    />
                ))}
            </div>
        </section>
    );
}
