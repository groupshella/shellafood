"use client";

import { Trash2 } from "lucide-react";
import SearchChip from "./SearchChip";

interface RecentSearchesProps {
    searches: string[];
    activeQuery: string;
    onSelect: (term: string) => void;
    onClear: () => void;
}

export default function RecentSearches({
    searches,
    activeQuery,
    onSelect,
    onClear,
}: RecentSearchesProps) {
    if (searches.length === 0) return null;

    return (
        <section aria-label="عمليات البحث الأخيرة" className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-neutral-500">عمليات البحث الأخيرة</h2>
                <button
                    type="button"
                    onClick={onClear}
                    className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    aria-label="مسح عمليات البحث الأخيرة"
                >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {searches.map((term) => (
                    <SearchChip
                        key={term}
                        label={term}
                        isActive={activeQuery === term}
                        onClick={() => onSelect(term)}
                    />
                ))}
            </div>
        </section>
    );
}
