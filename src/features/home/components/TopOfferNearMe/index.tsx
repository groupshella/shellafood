"use client";

import { MapPin } from "lucide-react";
import { useStores } from "../../hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function TopOfferNearMe() {
    const { stores, isLoading, error } = useStores({ endpoint: "top-offer", limit: 8 });

    return (
        <StoreSection
            title="أفضل العروض قريب منك"
            subtitle="العروض الأفضل ترتيباً بالمسافة"
            stores={stores}
            isLoading={isLoading}
            error={error}
            viewAllHref="/stores/top-offer"
            viewAllLabel="عرض جميع العروض"
            skeletonCount={5}
            layout="scroll"
            icon={<MapPin className="w-4 h-4" />}
            accentColor="from-cyan-500 to-teal-600"
        />
    );
}