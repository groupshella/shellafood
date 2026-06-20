import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStoreCategories } from "@/features/hyper-market/Categories/api/categories";
import { CategoriesPageShell } from "@/features/hyper-market/Categories/components/CategoriesPageShell";
import { CategoryTabs } from "@/features/hyper-market/Categories/components/sections/CategoryTabs";
import { CategoryDetail } from "@/features/hyper-market/Categories/components/sections/CategoryDetail";

const STORE_ID = "1";
const MODULE_ID = "3";

export const metadata: Metadata = {
	title: "تصنيفات هايبر ماركت | شلة فود",
	description: "تصفح تصنيفات هايبر ماركت والمنتجات المتوفرة.",
};

interface HyperMarketCategoriesPageProps {
	searchParams: Promise<{ categoryId?: string }>;
}

export default async function HyperMarketCategoriesPage({
	searchParams,
}: HyperMarketCategoriesPageProps) {
	const { categoryId } = await searchParams;

	let activeCategoryId = categoryId;

	if (!activeCategoryId) {
		const categories = await getStoreCategories(STORE_ID);
		if (categories.length === 0) redirect("/hyper-market");
		activeCategoryId = String(categories[0].id);
		redirect(`/hyper-market/categories?categoryId=${activeCategoryId}`);
	}

	return (
		<CategoriesPageShell moduleId={MODULE_ID}>
			<Suspense fallback={<CategoryTabs.skeleton />}>
				<CategoryTabs storeId={STORE_ID} activeCategoryId={activeCategoryId} />
			</Suspense>

			<Suspense key={activeCategoryId} fallback={<CategoryDetail.skeleton />}>
				<CategoryDetail storeId={STORE_ID} categoryId={activeCategoryId} />
			</Suspense>
		</CategoriesPageShell>
	);
}
