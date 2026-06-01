"use client";

import { Tag } from "lucide-react";
import { useStores } from "../../../(modules)/stores/hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function DiscountedStores() {
    const { stores, loading, error } = useStores({ endpoint: "discounted", limit: 8 });

    return (
        <StoreSection
            title="مخفضات الأسعار"
            subtitle="المتاجر التي لديها عروض مفعلة"
            stores={stores}
            isLoading={loading}
            error={error}
            viewAllHref="/stores/discounted"
            viewAllLabel="عرض جميع العروض"
            layout="scroll"
            icon={<Tag className="w-4 h-4" />}
            accentColor="from-pink-500 to-rose-600"
        />
    );
}