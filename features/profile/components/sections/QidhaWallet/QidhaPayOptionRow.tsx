"use client";

import { useLanguage } from "@/features/language/useLanguage";
import type { QidhaPayOption } from "@/features/profile/types/qidha.types";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function QidhaPayOptionRow({
    option,
    amount,
    selected,
    onSelect,
}: {
    option: Exclude<QidhaPayOption, "custom">;
    amount: number;
    selected: boolean;
    onSelect: () => void;
}) {
    const { isArabic } = useLanguage();
    const label =
        option === "full"
            ? isArabic
                ? "المبلغ المستحق بالكامل"
                : "Full amount due"
            : isArabic
              ? "المبلغ الأدنى المستحق"
              : "Minimum amount due";

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={[
                "flex w-full items-center justify-between gap-3 rounded-[14px] border px-3.5 py-3.5 transition-colors sm:px-4",
                selected
                    ? "border-[#30913F] bg-[#EBFEEB] dark:border-[#30913F] dark:bg-[#30913F]/15"
                    : "border-[#E8ECEF] bg-[#F6F5F8] dark:border-gray-700 dark:bg-gray-800",
            ].join(" ")}
        >
            <span
                className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    selected
                        ? "border-[#30913F]"
                        : "border-[#C6C8CE] dark:border-gray-500",
                ].join(" ")}
                aria-hidden
            >
                {selected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#30913F]" />
                )}
            </span>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                    <SarIcon width={13} height={14} />
                    <span
                        className="text-[15px] font-bold tabular-nums sm:text-[16px]"
                        style={AFACAD}
                    >
                        {amount.toFixed(2)}
                    </span>
                </div>
                <span
                    className="text-[13px] font-bold text-[#111B18] dark:text-gray-100 sm:text-[14px]"
                    style={TAJAWAL}
                >
                    {label}
                </span>
            </div>
        </button>
    );
}
