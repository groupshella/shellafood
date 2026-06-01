
"use client";

import { SlidersHorizontal, Grid2x2, Grid3x3 } from "lucide-react";
import Breadcrumbs from "../shared/Breadcrumbs";
import { FiltersSidebar } from "../shared";
import type { StoreList } from "../../types/store.types";
import type { ApiCategory } from "../../types/api-category.types";
import { useLanguage } from "@/providers/LanguageProvider";
import { useMemo, useState, useTransition } from "react";
import { useFilters } from "@/shared/hooks";
import { useSearchParams } from "next/navigation";
import StoreCategories from "./StoreCategories";
import ModuleStoresList from "./ModuleStoresList";

interface CategoryViewProps {
  initialStoreList: StoreList;
  initialCategories: ApiCategory[];
  moduleId: number;
  initialPage: number;
  initialLimit: number;
}

export default function CategoryView({
  initialStoreList,
  initialCategories,
  moduleId,
  initialPage,
  initialLimit,
}: CategoryViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [mobileViewMode, setMobileViewMode] = useState<"single" | "double">("single");
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
      { label: isArabic ? "الأقسام" : "Categories", href: "/categories" },
      { label: searchParams.get("moduleName") || "" },
    ],
    [isArabic, searchParams],
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="mb-1 text-2xl font-black text-gray-900 dark:text-white sm:mb-2 sm:text-3xl lg:text-4xl">
                {searchParams.get("moduleName") || (isArabic ? "المتاجر" : "Stores")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                {isArabic
                  ? `اكتشف ${initialStoreList?.total_size || 0} متجر في منطقتك`
                  : `Discover ${initialStoreList?.total_size || 0} stores in your area`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-4 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 sm:px-4 sm:text-base"
              >
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{isArabic ? "الفلاتر" : "Filters"}</span>
                {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-green-600" />}
              </button>

              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 sm:hidden dark:bg-gray-700">
                <button
                  type="button"
                  onClick={() => setMobileViewMode("single")}
                  className={`rounded p-1.5 transition-colors ${mobileViewMode === "single"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                    }`}
                  aria-label={isArabic ? "عرض واحد" : "Single view"}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewMode("double")}
                  className={`rounded p-1.5 transition-colors ${mobileViewMode === "double"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                    }`}
                  aria-label={isArabic ? "عرض مزدوج" : "Double view"}
                >
                  <Grid2x2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
              {initialStoreList?.total_size || 0} {isArabic ? "نتيجة" : "results"}
            </p>
          </div>
        </div>

        <div
          className={`mb-6 grid gap-6 sm:mb-8 lg:gap-8 ${showFilters ? "lg:grid-cols-[280px_1fr]" : "grid-cols-1"
            }`}
        >
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FiltersSidebar
              filters={filters}
              onFilterChange={(type, value) => updateFilter(type, value)}
              onClearAll={clearFilters}
            />
          </aside>

          <div className="min-w-0 space-y-5 sm:space-y-6">
            <StoreCategories categories={initialCategories} moduleId={moduleId} />
            <ModuleStoresList
              moduleId={moduleId}
              initialStoreList={initialStoreList}
              initialPage={initialPage}
              initialLimit={initialLimit}
              mobileViewMode={mobileViewMode}
              isPending={isPending}
              startTransition={startTransition}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
