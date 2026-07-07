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
        <div className="flex flex-col bg-white pb-2 dark:bg-gray-900">
            <CategoriesGridClient categories={store.categories} />
            {/* 
            {store.featured_store_discounted && <FeaturedDiscounted data={store.featured_store_discounted} />}
            {store.featured_store_products && <FeaturedProducts data={store.featured_store_products} />} */}

            {/* {store.category_products?.products?.length > 0 && (
                <CategoryProductsRow
                    products={store.category_products.products}
                    title={store.category_products.category_name}
                />
            )} */}
        </div>
    );
}
