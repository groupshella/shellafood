
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid2x2, Grid3x3 } from "lucide-react";
import StoreCard from "../store/StoreCard";
import Breadcrumbs from "../shared/Breadcrumbs";
import { EmptyState, FiltersSidebar } from "../shared";
import Pagination from "./Pagination";
import { staggerContainer } from "../../lib/utils/animations";
import type { StoreList } from "../../types/store.types";
import { useLanguage } from "@/providers/LanguageProvider";
import { useMemo, useState, useTransition } from "react";
import { useFilters, useMobile } from "@/shared/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import { CategoriesGridSkeleton } from "../category-list";
import DailyNeeded from "./DailyNeeded";

interface CategoryViewProps {
  initialStoreList: StoreList;
  moduleId: number;
  initialPage: number;
  initialLimit: number;
}

// ✅ Fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export default function CategoryView({
  initialStoreList,
  moduleId,
  initialPage,
  initialLimit,
}: CategoryViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useMobile(768);

  const [isPending, startTransition] = useTransition();
  const [mobileViewMode, setMobileViewMode] = useState<"single" | "double">("single");
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();
  const handleFilterChange = (filterType: string, value: any) => {
    updateFilter(filterType, value);
  };
  const handleClearFilters = () => {
    clearFilters();
  };

  // ✅ Get current page and limit from URL
  const currentOffset = Number(searchParams.get('page')) || initialPage;
  const currentLimit = initialLimit;


  // ✅ SWR for client-side pagination
  const { data: storeList, isLoading, error } = useSWR<StoreList>(
    `/api/stores?moduleId=${moduleId}&limit=${currentLimit}&offset=${currentOffset}`,
    fetcher,
    {
      fallbackData: initialStoreList,
      revalidateOnMount: false, // ✅ Don't refetch on mount
      revalidateOnFocus: false,
      keepPreviousData: true, // ✅ Show old data while fetching new
      dedupingInterval: 10000, // Cache for 10 seconds
    }
  );

  // ✅ Prefetch next page on current page load
  useSWR(
    storeList && currentOffset < Math.ceil(storeList.total_size / currentLimit)
      ? `/api/stores?moduleId=${moduleId}&limit=${currentLimit}&offset=${currentOffset + 1}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  // ✅ Prefetch previous page
  useSWR(
    currentOffset > 1
      ? `/api/stores?moduleId=${moduleId}&limit=${currentLimit}&offset=${currentOffset - 1}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
      { label: isArabic ? "الأقسام" : "Categories", href: "/categories" },
      { label: searchParams.get('moduleName') || '' },
    ],
    [isArabic, storeList]
  );

  const totalPages = storeList ? Math.ceil(storeList.total_size / currentLimit) : 1;

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    // Scroll to top first
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // ✅ Update URL without full page reload
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {searchParams.get('moduleName') || 'المتاجر'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                  {isArabic
                    ? `اكتشف ${storeList?.total_size || 0} متجر في منطقتك`
                    : `Discover ${storeList?.total_size || 0} stores in your area`
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Filter Bar - Simplified */}
          <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{isArabic ? "الفلاتر" : "Filters"}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </button>

              {/* Mobile View Toggle - Only visible on mobile */}
              <div className="sm:hidden flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setMobileViewMode("single")}
                  className={`p-1.5 rounded transition-colors ${mobileViewMode === "single"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                    }`}
                  aria-label={isArabic ? "عرض واحد" : "Single view"}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMobileViewMode("double")}
                  className={`p-1.5 rounded transition-colors ${mobileViewMode === "double"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                    }`}
                  aria-label={isArabic ? "عرض مزدوج" : "Double view"}
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {storeList?.total_size || 0} {isArabic ? "نتيجة" : "results"}
            </div>
          </div>
        </div>

        <div className={`grid lg:grid-cols-[280px_1fr] mb-6 sm:mb-8 gap-6 lg:gap-8 ${showFilters ? "block" : "hidden"} lg:block`}>
          {/* Filters Sidebar */}
          {showFilters && (
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          )}
        </div>

        {/* Loading Indicator */}
        <AnimatePresence>
          {(isPending || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center py-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-6"
            >
              <div className="w-5 h-5 border-2 border-green-600 dark:border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className={`${isArabic ? "mr-2" : "ml-2"} text-sm text-green-700 dark:text-green-400 font-medium`}>
                {isArabic ? "جاري التحميل..." : "Loading..."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stores Grid */}
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
                key={`stores-page-${currentOffset}`}

                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className={`grid ${mobileViewMode === "double"
                  ? "grid-cols-2 gap-2.5"
                  : "grid-cols-1 gap-4"
                  } sm:grid-cols-2 sm:gap-4 lg:gap-5`}
              >
                {storeList.stores.map((store) => (
                  <div key={store.id} className="w-full">
                    <StoreCard
                      isCompact={mobileViewMode === "double"}
                      store={store}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Pagination */}
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
              title={isArabic ? "لا توجد متاجر متاحة" : "No stores available"}
              description={isArabic ? "يرجى التحقق مرة أخرى لاحقاً" : "Please check back later"}
            />
          )}
        </div>
      </div>
    </div>
  );
}