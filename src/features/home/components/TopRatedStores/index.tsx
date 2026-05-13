"use client";

import { Star } from "lucide-react";
import { useStores } from "../../hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function TopRatedStores() {
    const { stores, isLoading, error } = useStores({ endpoint: "top-rated", limit: 8 });

    return (
        <StoreSection
            title="المتاجر الأعلى تقييماً"
            subtitle="المتاجر الأعلى تقييماً قريب منك"
            stores={stores}
            isLoading={isLoading}
            error={error}
            viewAllHref="/stores/top-rated"
            viewAllLabel="عرض جميع المتاجر الأعلى تقييماً"
            skeletonCount={5}
            layout="scroll"
            icon={<Star className="w-4 h-4" />}
            accentColor="from-amber-500 to-yellow-500"
        />
    );
}   