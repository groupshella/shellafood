"use client";

import { useState } from "react";

export function DiscountCodeClient() {
    const [code, setCode] = useState("");

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">لديك كود خصم ؟</h2>

            <div className="flex items-center gap-2 rounded-xl bg-[#F6F5F8] p-1.5">
                <input
                    type="text"
                    dir="ltr"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال : SHELLA2026"
                    className="flex-1 bg-transparent px-3 py-2.5 text-right text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
                <button
                    type="button"
                    className="shrink-0 rounded-lg bg-[#30913F] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    تفعيل
                </button>
            </div>
        </div>
    );
}
