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
import { Category } from "../../types/category.types";
import { ApiCategory } from "../../types/api-category.types";

interface CategoryPageProps {
	initialStoreList: StoreList;
	moduleId: number;
	initialPage: number;
	initialLimit: number;
	initialCategories: ApiCategory[];
}

export default function CategoryPage({ initialStoreList, moduleId, initialPage, initialLimit, initialCategories }: CategoryPageProps) {

	return <CategoryView initialStoreList={initialStoreList} moduleId={moduleId} initialPage={initialPage} initialLimit={initialLimit} initialCategories={initialCategories} />;
}
