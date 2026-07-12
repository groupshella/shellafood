"use client";

import { StoreDetails } from "@/features/hyper-market/StoreDetails/types/store-details.types";
import {
    CategoryProductsRow,
    FeaturedDiscounted,
    FeaturedProducts,
} from "@/features/hyper-market/StoreDetails/components/sections/FeaturedSections/FeaturedSections";
import { CategoriesGridClient } from "@/features/hyper-market/StoreDetails/components/sections/CategoriesGrid/CategoriesGridClient";

interface StoreDetailsClientProps {
    store: StoreDetails;
    moduleId?: string;
    isArabic: boolean;
}

export function StoreDetailsClient({ store, moduleId, isArabic }: StoreDetailsClientProps) {
    return (
        <div className="flex flex-col pb-2" dir={isArabic ? "rtl" : "ltr"}>
            <CategoriesGridClient categories={store.categories} isArabic={isArabic} />

        </div>
    );
}
