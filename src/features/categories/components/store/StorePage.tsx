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
	return <StoreView store={store as StoreDetails} initialLimit={initialLimit} initialPage={initialPage} moduleId={moduleId} />
}

export default memo(StorePage);
