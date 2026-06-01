"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2x2, Grid3x3 } from "lucide-react";
import { Breadcrumbs } from "@/shared/components";
import { useMobile } from "@/shared/hooks";
import EmptyState from "@/features/(modules)/modules/components/EmptyState";
import { useAllStores } from "../hooks/useAllStores";
import type { Stores } from "../types/stores.type";
import StoreCard from "./StoreCard";
import Pagination from "./Pagination";

interface StoresPageProps {
    stores: Stores;
    moduleName: string;
    language: string;
    moduleId: number;
    initialPage: number;
    initialLimit: number;
    zoneId: number;
    longitude: string;
    latitude: string;
}

export default function StoresPage({
    stores,
    moduleName,
    language,
    moduleId,
    initialPage,
    initialLimit,
    zoneId,
    longitude,
    latitude,
}: StoresPageProps) {
    const isArabic = language === "ar";
    const isMobile = useMobile(768);
    const [mobileViewMode, setMobileViewMode] = useState<"single" | "double">("single");

    const {
        storeList,
        isLoading,
        error,
        isPending,
        currentPage,
        totalPages,
        handlePageChange,
    } = useAllStores({
        initialStores: stores,
        moduleId,
        initialPage,
        initialLimit,
        zoneId,
        longitude,
        latitude,
        language,
    });

    const breadcrumbItems = [
        { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
        { label: isArabic ? "الوحدات" : "Modules", href: "/modules" },
        { label: moduleName },
    ];

    if (!isLoading && !error && storeList.total_size === 0) {
        return (
            <EmptyState
                title={isArabic ? "لا توجد متاجر متاحة" : "No stores available"}
                description={isArabic ? "يرجى التحقق مرة أخرى لاحقاً" : "Please check back later"}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
            <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <Breadcrumbs items={breadcrumbItems} className="mb-6" />

                <div className="mb-6 sm:mb-8">
                    <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <h1 className="mb-1 text-2xl font-black text-gray-900 dark:text-white sm:mb-2 sm:text-3xl lg:text-4xl">
                                {moduleName || (isArabic ? "المتاجر" : "Stores")}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                                {isArabic
                                    ? `اكتشف ${storeList.total_size || 0} متجر في منطقتك`
                                    : `Discover ${storeList.total_size || 0} stores in your area`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-4 sm:p-4">
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
                </div>

                <div className="min-w-0 space-y-5 sm:space-y-6">
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

                    {error ? (
                        <EmptyState
                            title={isArabic ? "خطأ في تحميل المتاجر" : "Error loading stores"}
                            description={isArabic ? "يرجى المحاولة مرة أخرى" : "Please try again"}
                        />
                    ) : (
                        <>
                            <div
                                key={`stores-page-${currentPage}`}
                                className={`grid ${mobileViewMode === "double"
                                    ? "grid-cols-2 gap-2.5"
                                    : "grid-cols-1 gap-4"
                                    } sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-5`}
                            >
                                {storeList.stores.map((store, index) => (
                                    <StoreCard
                                        key={store.id}
                                        store={store}
                                        index={index}
                                        isCompact={mobileViewMode === "double"}
                                        isArabic={isArabic}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={storeList.total_size}
                                    itemsPerPage={initialLimit}
                                    maxVisiblePages={isMobile ? 5 : 7}
                                    disabled={isPending || isLoading}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
