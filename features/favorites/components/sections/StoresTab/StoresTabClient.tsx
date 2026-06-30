"use client";

import { useState } from "react";
import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { StoreCard } from "./StoreCard";
import type { FavoriteStore } from "@/features/favorites/types/favorites.types";

interface StoresTabClientProps {
    stores: FavoriteStore[];
}

export function StoresTabClient({ stores: initialStores }: StoresTabClientProps) {
    const [stores, setStores] = useState(initialStores);

    function handleRemove(storeId: number) {
        setStores((prev) => prev.filter((s) => s.id !== storeId));
    }

    if (stores.length === 0) {
        return <EmptyFavorites />;
    }

    const groups = groupByDate(stores);

    return (
        <div className="space-y-6 px-4 py-4">
            {groups.map((group) => (
                <section key={group.key}>
                    <p className="mb-2 text-right text-[13px] font-semibold text-[#707784]">
                        {group.label}
                    </p>
                    <div className="space-y-3">
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
