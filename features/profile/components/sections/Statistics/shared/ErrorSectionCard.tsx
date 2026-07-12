"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { useLanguage } from "@/features/language/useLanguage";
import { TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function ErrorSectionCard({
    message,
    onRetry,
}: {
    message?: string;
    onRetry: () => void;
}) {
    const { isArabic } = useLanguage();

    return (
        <div className="flex min-h-[71px] w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-[#FFDCDC] dark:border-red-900/40 bg-[#FFF6F6] dark:bg-red-950/20 px-4 py-6">
            <div className="flex items-center gap-1.5 text-[#DB2626] dark:text-red-400">
                <AlertTriangle className="h-4 w-4" strokeWidth={2} />
                <p className="text-center text-[14px] font-medium" style={TAJAWAL}>
                    {message ?? (isArabic ? "تعذّر تحميل البيانات" : "Could not load data")}
                </p>
            </div>
            <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-gray-800 px-3 py-1.5 text-[13px] font-bold text-[#111B18] dark:text-gray-100 shadow-[0px_1px_8px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.97]"
                style={TAJAWAL}
            >
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                {isArabic ? "إعادة المحاولة" : "Retry"}
            </button>
        </div>
    );
}
