"use client";

import { usePopularSearch } from "@/features/search/hooks/usePopularSearch";
import SearchChip from "./SearchChip";

function PopularSearchSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-400" />
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-400" />
                ))}
            </div>
        </div>
    );
}

interface PopularSearchProps {
    activeQuery: string;
    onSelect: (term: string) => void;
}

export default function PopularSearch({ activeQuery, onSelect }: PopularSearchProps) {
    const { items, isLoading, error } = usePopularSearch();

    if (isLoading) return <PopularSearchSkeleton />;
    if (error || items.length === 0) return null;

    return (
        <section aria-label="الأكثر بحثاً" className="space-y-3">
            <h2 className="text-base font-medium text-neutral-500">الأكثر بحثاً</h2>

            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <SearchChip
                        key={item.keyword}
                        label={item.keyword}
                        isActive={activeQuery === item.keyword}
                        onClick={() => onSelect(item.keyword)}
                    />
                ))}
            </div>
        </section>
    );
}
