"use client";

import { useMemo } from "react";
import CategoryView from "./CategoryView";
import { getStoresByCategorySlug, getCategoryBySlug } from "../../lib/helpers/testData";
import { decodeParam } from "../../lib/utils/url";

interface CategoryPageProps {
	categorySlug: string;
}

export default function CategoryPage({ categorySlug }: CategoryPageProps) {
	// Decode URL param
	const decodedCategorySlug = useMemo(() => decodeParam(categorySlug), [categorySlug]);
	
	// Get category data
	const category = useMemo(() => {
		return getCategoryBySlug(decodedCategorySlug);
	}, [decodedCategorySlug]);
	
	// Get stores for this category
	const stores = useMemo(() => {
		return getStoresByCategorySlug(decodedCategorySlug);
	}, [decodedCategorySlug]);
	
	return (
		<CategoryView 
			stores={stores} 
			categorySlug={decodedCategorySlug}
			categoryName={category?.name}
		/>
	);
}

