"use client";

import { useLanguage } from "@/features/language/useLanguage";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function WalletBalanceCard({ balance }: { balance: number }) {
    const { isArabic } = useLanguage();
    const display = balance.toFixed(2);

    return (
        <section
            className="relative w-full overflow-hidden rounded-[16px] px-4 py-7 sm:rounded-[18px] sm:px-5 sm:py-8"
            style={{
                background:
                    "linear-gradient(135deg, #3EC856 0%, #30913F 48%, #1E7A2C 100%)",
            }}
            aria-label={isArabic ? "الرصيد المتاح" : "Available balance"}
        >
            <div
                className="pointer-events-none absolute -start-8 -top-10 h-[140px] w-[140px] rounded-full bg-white/10"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -end-10 bottom-[-40px] h-[160px] w-[160px] rounded-full bg-white/8"
                aria-hidden
            />

            <div className="relative z-10 flex flex-col items-center gap-2 text-center text-white">
                <p
                    className="text-[14px] font-medium leading-[160%] text-white/90 sm:text-[15px]"
                    style={TAJAWAL}
                >
                    {isArabic ? "الرصيد المتاح" : "Available balance"}
                </p>
                <div className="flex items-center gap-1.5">
                    <SarIcon
                        width={22}
                        height={24}
                        className="text-white"
                    />
                    <span
                        className="text-[clamp(32px,9vw,42px)] font-extrabold leading-none tabular-nums tracking-tight"
                        style={AFACAD}
                    >
                        {display}
                    </span>
                </div>
            </div>
        </section>
    );
}
