"use client";

import { useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import { useLanguage } from "@/providers/LanguageProvider";
import { useMobile } from "@/shared/hooks";
import { staggerContainer } from "../../lib/utils/animations";
import { categoryStoresApiUrl } from "../../lib/utils/categoryRoutes";
import { getCategoryLabel } from "../../lib/utils/categoryLabel";
import type { ApiCategory } from "../../types/api-category.types";
import type { StoreList } from "../../types/store.types";
import StoreCard from "../store/StoreCard";
import { EmptyState } from "../shared";
import Pagination from "./Pagination";

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch category stores");
	return res.json();
};

interface CategoryStoresProps {
	categoryId: number;
	category?: ApiCategory | null;
	moduleId: number;
	initialStoreList: StoreList;
	initialPage: number;
	initialLimit: number;
	mobileViewMode: "single" | "double";
}

export default function CategoryStores({
	categoryId,
	category,
	moduleId,
	initialStoreList,
	initialPage,
	initialLimit,
	mobileViewMode,
}: CategoryStoresProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useMobile(768);
	const [isPending, startTransition] = useTransition();

	const currentOffset = Number(searchParams.get("page")) || initialPage;
	const currentLimit = initialLimit;

	const storesUrl = useMemo(
		() =>
			categoryStoresApiUrl(categoryId, {
				moduleId,
				limit: currentLimit,
				offset: currentOffset,
			}),
		[categoryId, moduleId, currentLimit, currentOffset],
	);

	const { data: storeList, isLoading, error } = useSWR<StoreList>(storesUrl, fetcher, {
		fallbackData: initialStoreList,
		revalidateOnMount: false,
		revalidateOnFocus: false,
		keepPreviousData: true,
		dedupingInterval: 10000,
	});

	const totalPages = storeList ? Math.ceil(storeList.total_size / currentLimit) : 1;
	const categoryName = category ? getCategoryLabel(category, isArabic) : "";

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		window.scrollTo({ top: 0, behavior: "smooth" });
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: true });
		});
	};

	return (
		<div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
			{categoryName && (
				<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
					{isArabic ? "تصنيف:" : "Category:"}{" "}
					<span className="font-bold text-gray-900 dark:text-white">{categoryName}</span>
					{" · "}
					{storeList?.total_size ?? 0} {isArabic ? "متجر" : "stores"}
				</p>
			)}

			<AnimatePresence>
				{(isPending || isLoading) && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 dark:border-green-800 dark:bg-green-900/20"
					>
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent dark:border-green-400" />
						<span className="text-sm font-medium text-green-700 dark:text-green-400">
							{isArabic ? "جاري التحميل..." : "Loading..."}
						</span>
					</motion.div>
				)}
			</AnimatePresence>

			<div id="stores-list">
				{error ? (
					<EmptyState
						icon="❌"
						title={isArabic ? "خطأ في تحميل المتاجر" : "Error loading stores"}
						description={isArabic ? "يرجى المحاولة مرة أخرى" : "Please try again"}
					/>
				) : storeList && storeList.stores.length > 0 ? (
					<>
						<motion.div
							key={`cat-stores-${categoryId}-p${currentOffset}`}
							variants={staggerContainer}
							initial="initial"
							animate="animate"
							className={`grid ${
								mobileViewMode === "double"
									? "grid-cols-2 gap-2.5"
									: "grid-cols-1 gap-4"
							} sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-5`}
						>
							{storeList.stores.map((store) => (
								<div key={store.id} className="w-full">
									<StoreCard isCompact={mobileViewMode === "double"} store={store} />
								</div>
							))}
						</motion.div>

						{totalPages > 1 && (
							<Pagination
								currentPage={currentOffset}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								totalItems={storeList.total_size}
								itemsPerPage={currentLimit}
								maxVisiblePages={isMobile ? 5 : 7}
								disabled={isPending || isLoading}
							/>
						)}
					</>
				) : (
					<EmptyState
						icon="🏪"
						title={isArabic ? "لا توجد متاجر في هذا التصنيف" : "No stores in this category"}
						description={
							isArabic
								? "جرّب تصنيفاً آخر أو اعرض جميع المتاجر"
								: "Try another category or view all stores"
						}
					/>
				)}
			</div>
		</div>
	);
}
