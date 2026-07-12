"use client";

import { useLanguage } from "@/features/language/useLanguage";
import type { QidhaWalletCard } from "@/features/profile/types/qidha.types";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

function formatCardNumber(value: string) {
    return value.replace(/(.{4})/g, "$1 ").trim();
}

export function QidhaCard({ card }: { card: QidhaWalletCard }) {
    const { isArabic } = useLanguage();
    const usedRatio =
        card.creditLimit > 0
            ? Math.min(1, Math.max(0, card.usedBalance / card.creditLimit))
            : 0;

    return (
        <section
            className="relative w-full"
            aria-label={isArabic ? "محفظة قيدها" : "Qidha wallet"}
        >
            <div
                className="relative overflow-hidden rounded-[20px] px-4 pb-14 pt-4 sm:px-5 sm:pb-16 sm:pt-5"
                style={{
                    background:
                        "linear-gradient(145deg, #3EC856 0%, #30913F 45%, #1E7A2C 100%)",
                }}
            >
                <div
                    className="pointer-events-none absolute -start-10 -top-12 h-[150px] w-[150px] rounded-full bg-white/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -end-12 bottom-0 h-[160px] w-[160px] rounded-full bg-white/8"
                    aria-hidden
                />

                <div className="relative z-10 flex flex-col gap-4 text-white">
                    <div className="flex items-start justify-between gap-3">
                        <span
                            className="rounded-[10px] border border-white/25 bg-white/15 px-3 py-1.5 text-[12px] font-medium backdrop-blur-sm"
                            style={TAJAWAL}
                        >
                            {card.statusLabel &&
                            card.statusLabel !== "available" &&
                            card.statusLabel !== "متاح"
                                ? card.statusLabel
                                : isArabic
                                  ? "متاح"
                                  : "Available"}
                        </span>

                        <div className="flex flex-col items-end gap-0.5 text-end">
                            <span
                                className="text-[13px] font-medium text-white/85 sm:text-[14px]"
                                style={TAJAWAL}
                            >
                                {isArabic ? "الرصيد المتاح" : "Available balance"}
                            </span>
                            <div className="flex items-center gap-1">
                                <SarIcon width={18} height={20} className="text-white" />
                                <span
                                    className="text-[clamp(28px,8vw,36px)] font-extrabold leading-none tabular-nums"
                                    style={AFACAD}
                                >
                                    {card.availableBalance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-end">
                        <span
                            className="text-[15px] font-bold tracking-[0.08em] tabular-nums sm:text-[16px]"
                            style={AFACAD}
                        >
                            {formatCardNumber(card.cardNumber)}
                        </span>
                        <div className="flex items-center gap-2 text-[12px] font-medium text-white/90 sm:text-[13px]">
                            <span style={TAJAWAL}>
                                {isArabic
                                    ? "تاريخ انتهاء الشهر"
                                    : "Month end date"}
                            </span>
                            <span className="tabular-nums" style={AFACAD}>
                                {card.expiryDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-20 -mt-10 mx-3 rounded-[14px] bg-white px-3.5 py-3 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] dark:bg-gray-800 sm:mx-4 sm:px-4 sm:py-3.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                        className="text-[12px] font-medium text-[#555555] dark:text-gray-400 sm:text-[13px]"
                        style={TAJAWAL}
                    >
                        {isArabic ? "الرصيد المستخدم" : "Used balance"}
                    </span>
                </div>

                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[#E8F5E9] dark:bg-[#30913F]/20">
                    <div
                        className="h-full rounded-full bg-[#30913F] transition-[width] duration-300"
                        style={{ width: `${usedRatio * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                        <SarIcon width={12} height={13} />
                        <span
                            className="text-[13px] font-bold tabular-nums sm:text-[14px]"
                            style={AFACAD}
                        >
                            {card.usedBalance.toFixed(2)}
                        </span>
                    </div>
                    <span
                        className="text-[12px] font-bold text-[#30913F] sm:text-[13px]"
                        style={TAJAWAL}
                    >
                        {isArabic ? "حدد البطاقة" : "Select card"}
                    </span>
                </div>
            </div>
        </section>
    );
}
