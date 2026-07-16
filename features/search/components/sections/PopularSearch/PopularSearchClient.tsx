"use client";

import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchChip } from "@/features/search/components/shared/SearchChip";
import { PopularSearchItem } from "@/features/search/types/popular-search.types";

const SECTION_HEADING =
    "text-sm font-bold text-foreground sm:text-base lg:text-lg";

interface PopularSearchClientProps {
    items: PopularSearchItem[];
    isArabic: boolean;
}

export function PopularSearchClient({ items, isArabic }: PopularSearchClientProps) {
    const { query, handleSubmit } = useSearchContext();

    return (
        <section
            aria-label={isArabic ? "الأكثر بحثاً" : "Popular searches"}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className={SECTION_HEADING}>
                {isArabic ? "الأكثر بحثاً" : "Popular searches"}
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-2.5 lg:gap-3">
                {items.map((item) => (
                    <SearchChip
                        key={item.keyword}
                        label={item.keyword}
                        isActive={query === item.keyword}
                        onClick={() => handleSubmit(item.keyword)}
                    />
                ))}
            </div>
        </section>
    );
}
