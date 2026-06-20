"use client";

import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchChip } from "@/features/search/components/shared/SearchChip";
import { PopularSearchItem } from "@/features/search/types/popular-search.types";

interface PopularSearchClientProps {
    items: PopularSearchItem[];
}

export function PopularSearchClient({ items }: PopularSearchClientProps) {
    const { query, handleSelect } = useSearchContext();

    return (
        <section aria-label="الأكثر بحثاً" className="space-y-3">
            <h2 className="text-base font-medium text-neutral-500">الأكثر بحثاً</h2>

            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <SearchChip
                        key={item.keyword}
                        label={item.keyword}
                        isActive={query === item.keyword}
                        onClick={() => handleSelect(item.keyword)}
                    />
                ))}
            </div>
        </section>
    );
}
