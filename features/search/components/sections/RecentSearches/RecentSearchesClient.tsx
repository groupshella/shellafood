"use client";

import { Trash2 } from "lucide-react";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchChip } from "@/features/search/components/shared/SearchChip";

const SECTION_HEADING =
    "text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-base lg:text-lg";

export function RecentSearchesClient() {
    const { query, handleSubmit, recentSearches, clearRecent, isHydrated } = useSearchContext();

    if (!isHydrated || recentSearches.length === 0) return null;

    return (
        <section aria-label="عمليات البحث الأخيرة" className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className={SECTION_HEADING}>عمليات البحث الأخيرة</h2>
                <button
                    type="button"
                    onClick={clearRecent}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:text-gray-500 dark:active:bg-gray-800 sm:h-10 sm:w-10"
                    aria-label="مسح عمليات البحث الأخيرة"
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
