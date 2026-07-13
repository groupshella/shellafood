"use client";

import { useState } from "react";

export function DiscountCodeClient() {
    const [code, setCode] = useState("");

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">لديك كود خصم؟</h2>

            <div className="flex flex-col gap-2 rounded-xl p-1.5 sm:flex-row sm:items-center sm:gap-2 sm:p-2">
                <input
                    type="text"
                    dir="ltr"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال : SHELLA2026"
                    aria-label="كود الخصم"
                    className="min-h-11 flex-1 bg-transparent px-3 py-2.5 text-right text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500 sm:min-h-12 sm:text-[15px]"
                />
                <button
                    type="button"
                    disabled={!code.trim()}
                    className="min-h-11 shrink-0 rounded-lg bg-[#30913F] px-5 py-2.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:px-6 sm:text-[15px]"
                >
                    تفعيل
                </button>
            </div>
        </div>
    );
}
