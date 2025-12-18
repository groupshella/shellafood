
"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Grid2x2, Grid3x3 } from "lucide-react";
import StoreCard from "../store/StoreCard";
import Breadcrumbs from "../shared/Breadcrumbs";
import { EmptyState } from "../shared";
import Pagination from "./Pagination";
import { staggerContainer } from "../../lib/utils/animations";
import type { StoreList } from "../../types/store.types";
import { useLanguage } from "@/providers/LanguageProvider";
import { useMemo, useState, useTransition } from "react";
import { useMobile } from "@/shared/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { CategoriesGridSkeleton } from "../category-list";

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
  const searchParams = useSearchParams();
  const isMobile = useMobile(768);
  
  const [isPending, startTransition] = useTransition();
  const [mobileViewMode, setMobileViewMode] = useState<"single" | "double">("single");
  
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
      ? `/api/stores?moduleId=${moduleId}&limit=${currentLimit}&offset=${currentOffset+1}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  // ✅ Prefetch previous page
  useSWR(
    currentOffset > 1
      ? `/api/stores?moduleId=${moduleId}&limit=${currentLimit}&offset=${currentOffset-1}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
      { label: isArabic ? "الأقسام" : "Categories", href: "/categories" },
      { label: storeList?.stores[0]?.module?.module_name || (isArabic ? "القسم" : "Category") },
    ],
    [isArabic, storeList]
  );

  const totalPages = storeList ? Math.ceil(storeList.total_size / currentLimit) : 1;

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    // ✅ Update URL without full page reload
    startTransition(() => {
      router.push(`/categories/${moduleId}?${params.toString()}`, { scroll: false });
    });
    
    // ✅ Smooth scroll to top of store list
    const storesList = document.getElementById('stores-list');
    if (storesList) {
      storesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

if(isLoading || isPending) {
  return <CategoriesGridSkeleton />;
}

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
                  {storeList?.stores[0]?.module?.module_name || (isArabic ? "المتاجر" : "Stores")}
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
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View Toggle */}
            <div className="sm:hidden flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMobileViewMode("single")}
                className={`p-1.5 rounded transition-colors ${
                  mobileViewMode === "single"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                aria-label={isArabic ? "عرض واحد" : "Single view"}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileViewMode("double")}
                className={`p-1.5 rounded transition-colors ${
                  mobileViewMode === "double"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                aria-label={isArabic ? "عرض مزدوج" : "Double view"}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Loading indicator */}
            {(isLoading || isPending) && (
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            )}
            
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {storeList?.total_size || 0} {isArabic ? "نتيجة" : "results"}
            </div>
          </div>
        </div>

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
                className={`grid ${
                  mobileViewMode === "double" 
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