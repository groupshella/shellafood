"use client";

import { ThumbsUp } from "lucide-react";
import { useStores } from "../../../(modules)/stores/hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function RecommendedStores() {
    const { stores, loading, error } = useStores({ endpoint: "recommended", limit: 8 });

    return (
        <StoreSection
            title="موصى به لك"
            subtitle="المتاجر الموصى بها لك"
            stores={stores}
            isLoading={loading}
            error={error}
            viewAllHref="/stores/recommended"
            viewAllLabel="عرض جميع المتاجر الموصى بها"
            layout="scroll"
            icon={<ThumbsUp className="w-4 h-4" />}
            accentColor="from-green-500 to-emerald-600"
        />
    );
}