"use client";

import { Trash2 } from "lucide-react";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchChip } from "@/features/search/components/shared/SearchChip";

export function RecentSearchesClient() {
    const { query, handleSelect, recentSearches, clearRecent, isHydrated } = useSearchContext();

    if (!isHydrated || recentSearches.length === 0) return null;

    return (
        <section aria-label="عمليات البحث الأخيرة" className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-neutral-500">عمليات البحث الأخيرة</h2>
                <button
                    type="button"
                    onClick={clearRecent}
                    className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    aria-label="مسح عمليات البحث الأخيرة"
                >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                    <SearchChip
                        key={term}
                        label={term}
                        isActive={query === term}
                        onClick={() => handleSelect(term)}
                    />
                ))}
            </div>
        </section>
    );
}
