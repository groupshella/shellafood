"use client";

import { TrendingUp } from "lucide-react";
import { useStores } from "../../../(modules)/stores/hooks/useStores";
import { StoreSection } from "../StoreSection/StoreSection";

export default function PopularStoresSection() {
	const { stores, loading, error } = useStores({ endpoint: "popular", limit: 8 });

	return (
		<StoreSection
			title="الأكثر مبيعاً"
			subtitle="المتاجر الأكثر مبيعاً"
			stores={stores}

			isLoading={loading}
			error={error}
			viewAllHref="/stores/popular"
			viewAllLabel="عرض جميع المتاجر الأكثر مبيعاً"
			layout="scroll"
			icon={<TrendingUp className="w-4 h-4" />}
			accentColor="from-orange-500 to-red-500"
		/>
	);
}