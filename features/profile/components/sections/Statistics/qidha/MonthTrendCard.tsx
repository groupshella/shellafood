"use client";

import { useLanguage } from "@/features/language/useLanguage";
import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsMonthTrend } from "@/features/profile/types/statistics.types";
import { SarIcon } from "../shared/SarIcon";

const MONTH_LABELS = [
    { ar: "يناير", en: "January" },
    { ar: "فبراير", en: "February" },
    { ar: "مارس", en: "March" },
    { ar: "إبريل", en: "April" },
    { ar: "مايو", en: "May" },
    { ar: "يونيو", en: "June" },
    { ar: "يوليو", en: "July" },
    { ar: "أغسطس", en: "August" },
    { ar: "سبتمبر", en: "September" },
    { ar: "أكتوبر", en: "October" },
    { ar: "نوفمبر", en: "November" },
    { ar: "ديسمبر", en: "December" },
] as const;

export function MonthTrendCard({
    trend,
    isEmpty,
}: {
    trend: StatisticsMonthTrend;
    isEmpty: boolean;
}) {
    const { isArabic } = useLanguage();
    const total = isEmpty ? "0.00" : trend.total;
    const average = isEmpty ? "0.00" : trend.average;
    const count = isEmpty ? 0 : trend.operationCount;
    const totalColor = total === "0.00" ? "#111B18" : "#30913F";
    const monthLabel = MONTH_LABELS.find(
        (month) => month.ar === trend.month || month.en === trend.month,
    );

    return (
        <div className="flex h-[124px] w-[141px] shrink-0 flex-col items-start justify-center gap-1 rounded-[12px] border border-[#F0EEF3] bg-white px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-800">
            <span
                className="text-[13px] font-bold text-[#111B18] dark:text-gray-100"
                style={TAJAWAL}
            >
                {monthLabel ? (isArabic ? monthLabel.ar : monthLabel.en) : trend.month}
            </span>
            <div className="flex items-center gap-0.5" style={{ color: totalColor }}>
                <SarIcon width={13} height={14.56} />
                <span className="text-[18px] font-bold tabular-nums" style={TAJAWAL}>
                    {total}
                </span>
            </div>
            <span
                className="text-[10px] font-medium text-[#555555] dark:text-gray-400"
                style={TAJAWAL}
            >
                {isArabic
                    ? `${count} عملية`
                    : `${count} ${count === 1 ? "operation" : "operations"}`}
            </span>
            <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                <span className="text-[10px] font-medium" style={TAJAWAL}>
                    {isArabic ? "متوسط" : "Average"}
                </span>
                <SarIcon width={9.53} height={10.68} />
                <span className="text-[12px] font-semibold tabular-nums" style={TAJAWAL}>
                    {average}
                </span>
            </div>
        </div>
    );
}
