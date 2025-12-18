"use client";

import { useMemo } from "react";
import CategoryView from "./CategoryView";
import { getStoresByCategorySlug, getCategoryBySlug } from "../../lib/helpers/testData";
import { decodeParam } from "../../lib/utils/url";
import { useStores } from "../../hooks/useStores";
import { EmptyState } from "../shared";
import { useLanguage } from "@/providers/LanguageProvider";
import CategoriesGridSkeleton from "../category-list/CategoriesSkeleton";
import { StoreList } from "../../types/store.types";

interface CategoryPageProps {
	initialStoreList: StoreList;
	moduleId: number;
	initialPage: number;
	initialLimit: number;
  }

export default function CategoryPage({ initialStoreList, moduleId, initialPage, initialLimit }: CategoryPageProps) {
	
	return <CategoryView initialStoreList={initialStoreList} moduleId={moduleId} initialPage={initialPage} initialLimit={initialLimit} />;
}
