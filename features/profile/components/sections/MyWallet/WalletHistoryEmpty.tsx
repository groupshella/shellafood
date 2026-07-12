"use client";

import Image from "next/image";

import { useLanguage } from "@/features/language/useLanguage";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function WalletHistoryEmpty() {
    const { isArabic } = useLanguage();

    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-10 sm:py-14">
            <div
                className="relative aspect-[241/180] w-full max-w-[220px] sm:max-w-[240px]"
                aria-hidden
            >
                <Image
                    src="/my-orders/orders-empty.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 220px, 240px"
                    priority
                />
            </div>
            <p
                className="max-w-[280px] text-center text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px]"
                style={TAJAWAL}
            >
                {isArabic
                    ? "لا يوجد معاملات في الوقت الحالي"
                    : "No transactions at the moment"}
            </p>
        </div>
    );
}
