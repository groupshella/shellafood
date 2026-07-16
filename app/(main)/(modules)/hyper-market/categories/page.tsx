import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoriesPageShell } from "@/features/hyper-market/Categories/components/CategoriesPageShell";
import { AllCategories } from "@/features/hyper-market/Categories/components/sections/AllCategories";
import { CategoryTabs } from "@/features/hyper-market/Categories/components/sections/CategoryTabs";
import { CategoryDetail } from "@/features/hyper-market/Categories/components/sections/CategoryDetail";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { isArabicLocale } from "@/shared/lib/locale";

const STORE_ID = "1";
const MODULE_ID = "3";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "تصنيفات هايبر ماركت | شلة فود"
			: "Hypermarket categories | Shella Food",
		description: isArabic
			? "تصفح تصنيفات هايبر ماركت والمنتجات المتوفرة."
			: "Browse hypermarket categories and available products.",
	};
}

interface HyperMarketCategoriesPageProps {
	searchParams: Promise<{ categoryId?: string }>;
}

export default async function HyperMarketCategoriesPage({
	searchParams,
}: HyperMarketCategoriesPageProps) {
	const isArabic = await isArabicLocale();
	const { categoryId } = await searchParams;

	return (
		<CategoriesPageShell moduleId={MODULE_ID} isArabic={isArabic}>
			{categoryId ? (
				<>
					<Suspense fallback={<CategoryTabs.skeleton />}>
						<CategoryTabs
							storeId={STORE_ID}
							activeCategoryId={categoryId}
							isArabic={isArabic}
						/>
					</Suspense>

					<Suspense key={categoryId} fallback={<CategoryDetail.skeleton />}>
						<CategoryDetail
							storeId={STORE_ID}
							categoryId={categoryId}
							isArabic={isArabic}
						/>
					</Suspense>
				</>
			) : (
				<Suspense fallback={<AllCategories.skeleton />}>
					<AllCategories storeId={STORE_ID} isArabic={isArabic} />
				</Suspense>
			)}

			<AddToCart moduleId={MODULE_ID} />
		</CategoriesPageShell>
	);
}
