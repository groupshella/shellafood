"use client";

import Image from "next/image";

import { useLanguage } from "@/features/language/useLanguage";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function PointsHistoryEmpty() {
    const { isArabic } = useLanguage();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-5 py-10 sm:py-14">
            <div
                className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px]"
                aria-hidden
            >
                <Image
                    src="/profile/points-empty.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 180px, 200px"
                    priority
                />
            </div>
            <p
                className="max-w-[280px] text-center text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px]"
                style={TAJAWAL}
            >
                {isArabic
                    ? "للأسف لم تربح نقاط حتى الاَن"
                    : "You haven't earned any points yet"}
            </p>
        </div>
    );
}
