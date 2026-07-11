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
}

export function StoreDetailsClient({ store, moduleId }: StoreDetailsClientProps) {
    return (
        <div className="flex flex-col pb-2">
            <CategoriesGridClient categories={store.categories} />

        </div>
    );
}
