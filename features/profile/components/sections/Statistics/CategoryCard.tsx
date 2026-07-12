"use client";

import { useLanguage } from "@/features/language/useLanguage";
import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsCategory } from "@/features/profile/types/statistics.types";

export function CategoryCard({ category }: { category: StatisticsCategory }) {
    const { isArabic } = useLanguage();

    return (
        <div className="flex min-h-[72px] w-full items-center justify-between gap-3 rounded-[14px] border border-[#F0EEF3] bg-white px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-800">
            {/* First in RTL = right: icon + name */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-[12px] bg-[#F0EEF3] dark:bg-gray-700" />
                <div className="flex min-w-0 flex-col items-start gap-0.5">
                    <span
                        className="w-full truncate text-start text-[14px] font-bold text-[#1F2937] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {category.name}
                    </span>
                    <span
                        className="text-[11px] font-medium text-[#8A8F98] dark:text-gray-400"
                        style={TAJAWAL}
                    >
                        {isArabic
                            ? `${category.purchaseCount} عملية شراء`
                            : `${category.purchaseCount} ${
                                  category.purchaseCount === 1 ? "purchase" : "purchases"
                              }`}
                    </span>
                </div>
            </div>
            {/* Second in RTL = left: amount + % */}
            <div className="flex shrink-0 flex-col items-end">
                <span
                    className="text-[15px] font-bold tabular-nums text-[#1F2937] dark:text-gray-100"
                    style={TAJAWAL}
                >
                    {category.amount}
                </span>
                <span
                    className="text-[12px] font-medium text-[#8A8F98] dark:text-gray-500"
                    style={TAJAWAL}
                >
                    {category.percentage}
                </span>
            </div>
        </div>
    );
}
