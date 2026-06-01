"use client";

import { Sparkles } from "lucide-react";
import { useStores } from "../../../(modules)/stores/hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function LatestStores() {
    const { stores, loading, error } = useStores({ endpoint: "latest", limit: 8 });

    return (
        <StoreSection
            title="جديد على الموقع"
            subtitle="المتاجر الجديدة"
            stores={stores}
            isLoading={loading}
            error={error}
            viewAllHref="/stores/latest"
            viewAllLabel="عرض جميع المتاجر الجديدة"
            layout="scroll"
            icon={<Sparkles className="w-4 h-4" />}
            accentColor="from-violet-500 to-purple-600"
        />
    );
}