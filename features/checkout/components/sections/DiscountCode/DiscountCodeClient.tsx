"use client";

import { useState } from "react";

export function DiscountCodeClient({ isArabic }: { isArabic: boolean }) {
    const [code, setCode] = useState("");
    return (
        <div dir={isArabic ? "rtl" : "ltr"}>
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">{isArabic ? "لديك كود خصم؟" : "Do you have a discount code?"}</h2>

            <div className="flex flex-col gap-2 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800 sm:flex-row sm:items-center sm:gap-2 sm:p-2">
                <input
                    type="text"
                    dir={isArabic ? "rtl" : "ltr"}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={isArabic ? "مثال : SHELLA2026" : "Example: SHELLA2026"}
                    aria-label={isArabic ? "كود الخصم" : "Discount code"}
                    className="min-h-11 flex-1 bg-transparent px-3 py-2.5 text-right text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500 sm:min-h-12 sm:text-[15px]"
                />
                <button
                    type="button"
                    disabled={!code.trim()}
                    className="min-h-11 shrink-0 rounded-lg bg-[#30913F] px-5 py-2.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:px-6 sm:text-[15px]"
                >
                    {isArabic ? "تفعيل" : "Apply"}
                </button>
            </div>
        </div>
    );
}
