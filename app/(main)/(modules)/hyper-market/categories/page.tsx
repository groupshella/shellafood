import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoriesPageShell } from "@/features/hyper-market/Categories/components/CategoriesPageShell";
import { AllCategories } from "@/features/hyper-market/Categories/components/sections/AllCategories";
import { CategoryTabs } from "@/features/hyper-market/Categories/components/sections/CategoryTabs";
import { CategoryDetail } from "@/features/hyper-market/Categories/components/sections/CategoryDetail";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";

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

	return (
		<CategoriesPageShell moduleId={MODULE_ID}>
			{categoryId ? (
				<>
					<Suspense fallback={<CategoryTabs.skeleton />}>
						<CategoryTabs storeId={STORE_ID} activeCategoryId={categoryId} />
					</Suspense>

					<Suspense key={categoryId} fallback={<CategoryDetail.skeleton />}>
						<CategoryDetail storeId={STORE_ID} categoryId={categoryId} />
					</Suspense>
				</>
			) : (
				<Suspense fallback={<AllCategories.skeleton />}>
					<AllCategories storeId={STORE_ID} />
				</Suspense>
			)}

			<AddToCart moduleId={MODULE_ID} />
		</CategoriesPageShell>
	);
}
