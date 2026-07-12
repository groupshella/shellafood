"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/features/language/useLanguage";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { CategoryProductCard } from "@/features/hyper-market/Categories/components/sections/CategoryDetail/CategoryProductCard";
import { StoreCard } from "@/features/markets/components/sections/Stores/StoreCard";
import type { SearchProduct } from "@/features/search/types/search.types";
import type { Store } from "@/features/markets/types/stores.types";
import { toCategoryProduct } from "@/features/search/lib/to-category-product";
import { SearchEmptyState } from "./SearchEmptyState";

const SECTION_HEADING =
	"text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg";

const PRODUCTS_GRID =
	"grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5";

const STORES_GRID =
	"flex flex-col gap-2.5 sm:gap-3 md:grid md:grid-cols-2 md:gap-3.5 lg:gap-4";

const RESULTS_PADDING =
	"pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(7rem+env(safe-area-inset-bottom))]";

function ProductCardSkeleton() {
	return (
		<div className="relative flex min-h-[172px] w-full min-w-0 flex-row items-center gap-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 sm:min-h-[190px]">
			<div className="flex flex-1 flex-col items-end gap-2 self-stretch p-2">
				<div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[60px] sm:w-[60px]" />
				<div className="flex w-full flex-col gap-3 px-1">
					<div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-3 w-1/3 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
				</div>
			</div>
			<div className="flex shrink-0 flex-col items-center justify-between gap-3 self-stretch p-0.5">
				<div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
				<div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
			</div>
		</div>
	);
}

function SearchLoadingState() {
	const { isArabic, locale } = useLanguage();
	return (
		<div className={`space-y-6 sm:space-y-8 ${RESULTS_PADDING}`} aria-busy="true" aria-label={isArabic ? "جاري البحث" : "Searching"} dir={isArabic ? "rtl" : "ltr"} lang={locale}>
			<div className="space-y-3 sm:space-y-4">
				<div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-28" />
				<div className={PRODUCTS_GRID}>
					{Array.from({ length: 6 }).map((_, index) => (
						<ProductCardSkeleton key={index} />
					))}
				</div>
			</div>
			<div className="space-y-3 sm:space-y-4">
				<div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-28" />
				<div className="space-y-2.5 sm:space-y-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-[5.5rem]"
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function SearchErrorState({ message }: { message: string }) {
	const { isArabic, locale } = useLanguage();
	return (
		<div className="rounded-2xl bg-red-50 px-4 py-5 text-center text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400 sm:px-6 sm:py-6 sm:text-base" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
			{message}
		</div>
	);
}

function StoresSection({ stores }: { stores: Store[] }) {
	const { isArabic, locale } = useLanguage();
	if (stores.length === 0) return null;

	return (
		<section aria-label={isArabic ? "نتائج المتاجر" : "Store results"} className="space-y-3 sm:space-y-4" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
			<h2 className={SECTION_HEADING}>{isArabic ? "المتاجر" : "Stores"}</h2>
			<div className={STORES_GRID}>
				{stores.map((store) => (
					<StoreCard key={store.id} store={store} isArabic={isArabic} />
				))}
			</div>
		</section>
	);
}

function ProductsSection({
	products,
	hasMore,
	isLoadingMore,
	onLoadMore,
}: {
	products: SearchProduct[];
	hasMore: boolean;
	isLoadingMore: boolean;
	onLoadMore: () => void;
}) {
	const { isArabic, locale } = useLanguage();
	if (products.length === 0) return null;

	return (
		<section aria-label={isArabic ? "نتائج المنتجات" : "Product results"} className="space-y-3 sm:space-y-4" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
			<h2 className={SECTION_HEADING}>{isArabic ? "المنتجات" : "Products"}</h2>

			<div className={PRODUCTS_GRID}>
				{products.map((product) => (
					<CategoryProductCard
						key={product.id}
						product={toCategoryProduct(product)}
						layout="grid"
						moduleId={String(product.module_id)}
					/>
				))}
			</div>

			{hasMore && (
				<button
					type="button"
					onClick={onLoadMore}
					disabled={isLoadingMore}
					className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#30913F] py-3 text-sm font-semibold text-[#30913F] transition-colors active:bg-[#30913F]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#4db860] dark:text-[#4db860] dark:active:bg-[#30913F]/10 dark:focus-visible:ring-offset-gray-950 sm:mx-auto sm:max-w-md sm:py-3.5 sm:text-[15px] md:max-w-lg lg:max-w-xl"
				>
					{isLoadingMore ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]" aria-hidden />
							<span>{isArabic ? "جاري التحميل..." : "Loading more..."}</span>
						</>
					) : (
						isArabic ? "عرض المزيد" : "Show more"
					)}
				</button>
			)}
		</section>
	);
}

export function SearchResultsClient() {
	const { isArabic, locale } = useLanguage();
	const {
		results,
		isSearching,
		isLoadingMore,
		hasMore,
		loadMore,
		error,
		query,
		moduleId,
	} = useSearchContext();

	if (isSearching) {
		return (
			<>
				<SearchLoadingState />
				<AddToCart moduleId={moduleId} isArabic={isArabic} />
			</>
		);
	}

	if (error) {
		return (
			<>
				<SearchErrorState message={error} />
				<AddToCart moduleId={moduleId} isArabic={isArabic} />
			</>
		);
	}

	if (!results) return null;

	const products = results.items.products ?? [];
	const stores = results.stores.stores ?? [];

	if (products.length === 0 && stores.length === 0) {
		return (
			<>
				<SearchEmptyState query={query} />
				<AddToCart moduleId={moduleId} isArabic={isArabic} />
			</>
		);
	}

	return (
		<>
			<div className={`flex flex-col gap-6 sm:gap-8 lg:gap-10 ${RESULTS_PADDING}`} dir={isArabic ? "rtl" : "ltr"} lang={locale}>
				<StoresSection stores={stores} />
				<ProductsSection
					products={products}
					hasMore={hasMore}
					isLoadingMore={isLoadingMore}
					onLoadMore={loadMore}
				/>
			</div>
			<AddToCart moduleId={moduleId} isArabic={isArabic} />
		</>
	);
}
