"use client";

import { useState } from "react";
import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { StoreCard } from "./StoreCard";
import type { FavoriteStore } from "@/features/favorites/types/favorites.types";

const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5";
const SECTION_HEADING =
    "mb-2.5 text-start text-sm font-semibold text-gray-500 dark:text-gray-400 sm:mb-3 sm:text-[15px]";

interface StoresTabClientProps {
    stores: FavoriteStore[];
    isArabic: boolean;
}

export function StoresTabClient({ stores: initialStores, isArabic }: StoresTabClientProps) {
    const [stores, setStores] = useState(initialStores);

    function handleRemove(storeId: number) {
        setStores((prev) => prev.filter((s) => s.id !== storeId));
    }

    if (stores.length === 0) {
        return <EmptyFavorites isArabic={isArabic} />;
    }

    const groups = groupByDate(stores);

    return (
        <div className={`space-y-5 sm:space-y-6 ${CONTENT_PADDING}`}>
            {groups.map((group) => (
                <section key={group.key}>
                    <p className={SECTION_HEADING}>{group.label}</p>
                    <div className={ITEMS_GRID}>
                        {group.items.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                initialFavorited
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
