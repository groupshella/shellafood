"use client";

import { memo } from "react";
import StoreView from "./StoreView";
import { useMobile } from "@/shared/hooks";
import { useLanguage } from "@/providers/LanguageProvider";
import { useStoreDetails } from "../../hooks/useStoreDetails";
import { EmptyState, MobileStorePageSkeleton, StoreCardSkeleton } from "../shared";
import CategoriesGridSkeleton from "../category-list/CategoriesSkeleton";
import type { StoreDetails } from "../../types/store.details.types";

interface StorePageProps {
	store: StoreDetails;
	initialLimit: number;
	initialPage: number;
	moduleId: string;
}

function StorePage({
	store,
	initialLimit,
	initialPage,
	moduleId,
}: StorePageProps) {
	sessionStorage.setItem('module_id_store', store.module_id.toString());
    sessionStorage.setItem('zone_id_store', store.zone_id.toString());
    sessionStorage.setItem('longitude_store', store.longitude.toString());
    sessionStorage.setItem('latitude_store', store.latitude.toString());
	return <StoreView store={store as StoreDetails} initialLimit={initialLimit} initialPage={initialPage} moduleId={moduleId} />
}

export default memo(StorePage);
