"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Grid2x2, Grid3x3 } from "lucide-react";
import StoreCard from "../store/StoreCard";
import FiltersSidebar from "../shared/FiltersSidebar";
import Breadcrumbs from "../shared/Breadcrumbs";
import { EmptyState } from "../shared";
import Pagination from "./Pagination";
import { staggerContainer } from "../../lib/utils/animations";
import DailyNeeded from "./DailyNeeded";
import { useCategoryView } from "../../hooks/useCategoryView";
import type { Store } from "../../types/category.types";

interface CategoryViewProps {
  stores: Store[];
  categoryName?: string;
  categorySlug?: string;
}

function CategoryView({
  stores,
  categoryName,
  categorySlug,
}: CategoryViewProps) {
  const {
    isArabic,
    direction,
    mobileViewMode,
    setMobileViewMode,
    showFilters,
    setShowFilters,
    currentPage,
    isMobile,
    filters,
    hasActiveFilters,
    handleFilterChange,
    handleClearFilters,
    breadcrumbItems,
    filteredAndSortedStores,
    paginatedStores,
    totalPages,
    itemsPerPage,
    handleStoreClick,
    handlePageChange,
    translations: t,
  } = useCategoryView({ stores, categoryName, categorySlug });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Daily Needed Section - Only for Supermarket (Shown First) */}
        {categorySlug === "supermarket" && (
          <DailyNeeded />
        )}

        {/* Page Header - Moved below Daily Needed for Supermarket */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                  {t.subtitle}
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
                <span className="hidden sm:inline">{t.filters}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </button>

              {/* Mobile View Toggle - Only visible on mobile */}
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

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredAndSortedStores.length} {t.results}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </div>

          {/* Stores Grid - Always 2 columns */}
          <div id="stores-list">
            {filteredAndSortedStores.length > 0 ? (
              <>
                <motion.div
                  key={`stores-page-${currentPage}`}
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className={`grid ${
                    mobileViewMode === "double" 
                      ? "grid-cols-2 gap-2.5" 
                      : "grid-cols-1 gap-4"
                  } sm:grid-cols-2 sm:gap-4 lg:gap-5`}
                >
                  {paginatedStores.map((store) => {
                    // Determine store tags/badges
                    const storeTags: string[] = [];
                    
                    // Check if store is popular/common (high rating or many reviews)
                    const rating = typeof store.rating === "number" ? store.rating : parseFloat(String(store.rating || "0"));
                    if (rating >= 4.5 || (store.reviewsCount && store.reviewsCount > 100)) {
                      storeTags.push(isArabic ? "شائع" : "Popular");
                    }
                    
                    // Calculate hash once for multiple checks
                    const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    
                    // Check if store is close (mock distance check)
                    // In real app, this would use actual location data
                    const mockDistance = hash % 10;
                    if (mockDistance <= 2) {
                      storeTags.push(isArabic ? "قريب مني" : "Close to Me");
                    }
                    
                    // Check if previously ordered (mock check)
                    if (hash % 4 === 0) {
                      storeTags.push(isArabic ? "طلبت منها من قبل" : "Previously Ordered");
                    }
                    
                    return (
                      <div key={store.id} className="w-full">
                        <StoreCard
                          store={store}
                          onClick={handleStoreClick}
                          tags={storeTags}
                          isCompact={mobileViewMode === "double"}
                        />
                      </div>
                    );
                  })}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && filteredAndSortedStores.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredAndSortedStores.length}
                    itemsPerPage={itemsPerPage}
                    maxVisiblePages={isMobile ? 5 : 7}
                  />
                )}
              </>
            ) : (
              <EmptyState
                icon="🏪"
                title={t.noStores}
                description={t.noStoresDesc}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryView;

