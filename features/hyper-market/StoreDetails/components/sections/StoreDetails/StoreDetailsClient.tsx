"use client";

import { StoreDetails } from "@/features/hyper-market/StoreDetails/types/store-details.types";
import { CategoriesGridClient } from "@/features/hyper-market/StoreDetails/components/sections/CategoriesGrid/CategoriesGridClient";

interface StoreDetailsClientProps {
    store: StoreDetails;
    moduleId?: string;
    isArabic: boolean;
}

export function StoreDetailsClient({ store, isArabic }: StoreDetailsClientProps) {
    return (
        <div className="flex flex-col pb-2">
            <CategoriesGridClient categories={store.categories} isArabic={isArabic} />
        </div>
    );
}
