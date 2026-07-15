"use client";

import { useEffect, useRef } from "react";
import { CategoryProductCard } from "@/features/hyper-market/Categories/components/sections/CategoryDetail/CategoryProductCard";
import type { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";
import type { CategoryDetail, StoreProduct } from "@/features/stores/types/store.types";

export const STORE_CATEGORY_PRODUCTS_ID = "store-category-products";

interface StoreCategoryProductsClientProps {
	detail: CategoryDetail;
	moduleId: string;
	scrollIntoView?: boolean;
}

const contentContainer =
	"mx-auto w-full px-3 pb-4 pt-2.5 sm:px-4 sm:pb-5 sm:pt-3 md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl";

/** Mobile-only: horizontal list rows (unchanged mobile design). */
const PRODUCTS_LIST_MOBILE = "grid grid-cols-1 gap-2 md:hidden";

/** Desktop+: catalog-style grid cards. */
const PRODUCTS_GRID_DESKTOP =
	"hidden md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4";

function toCategoryProduct(product: StoreProduct): CategoryProduct {
	return {
		id: product.id,
		name: product.name,
		full_image_url: product.full_image_url || product.image_full_url || "",
		price: product.price,
		discounted_price: product.discounted_price ?? null,
		discount_percentage: product.discount_percentage ?? null,
	};
}

function ProductGrids({
	products,
	moduleId,
}: {
	products: StoreProduct[];
	moduleId: string;
}) {
	return (
		<>
			<div className={PRODUCTS_LIST_MOBILE}>
				{products.map((product) => (
					<CategoryProductCard
						key={`list-${product.id}`}
						product={toCategoryProduct(product)}
						layout="list"
						moduleId={moduleId}
					/>
				))}
			</div>
			<div className={PRODUCTS_GRID_DESKTOP}>
				{products.map((product) => (
					<CategoryProductCard
						key={`grid-${product.id}`}
						product={toCategoryProduct(product)}
						layout="grid"
						moduleId={moduleId}
					/>
				))}
			</div>
		</>
	);
}

export function StoreCategoryProductsClient({
	detail,
	moduleId,
	scrollIntoView = false,
}: StoreCategoryProductsClientProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const allProducts = detail.sub_categories.flatMap((sc) => sc.products);

	useEffect(() => {
		if (!scrollIntoView) return;
		sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [scrollIntoView, detail.category_id]);

	if (allProducts.length === 0) {
		return (
			<div
				id={STORE_CATEGORY_PRODUCTS_ID}
				ref={sectionRef}
				className={`flex flex-col items-center justify-center py-12 text-center sm:py-16 md:py-20 ${contentContainer}`}
			>
				<p className="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base">
					لا توجد منتجات في هذا التصنيف
				</p>
			</div>
		);
	}

	return (
		<div id={STORE_CATEGORY_PRODUCTS_ID} ref={sectionRef} className={contentContainer}>
			{detail.sub_categories.map((sc) => {
				if (sc.products.length === 0) return null;
				return (
					<section key={sc.id} className="mb-4 last:mb-0 sm:mb-5 md:mb-6 lg:mb-8">
						{detail.sub_categories.length > 1 && (
							<h2 className="mb-2.5 text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:mb-3 sm:text-base md:mb-3.5 md:text-lg">
								{sc.name}
							</h2>
						)}

						<ProductGrids products={sc.products} moduleId={moduleId} />
					</section>
				);
			})}
		</div>
	);
}
