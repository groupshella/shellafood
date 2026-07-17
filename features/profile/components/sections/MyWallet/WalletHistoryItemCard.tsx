"use client";

import { ChevronLeft } from "lucide-react";
import Image from "@/shared/components/SecureImage";
import { useRouter } from "next/navigation";

import type { WalletHistoryItem } from "@/features/profile/types/wallet.types";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function WalletHistoryItemCard({ item }: { item: WalletHistoryItem }) {
    const router = useRouter();
    const isCredit = item.tone === "credit";
    const amountLabel = `${isCredit ? "+" : "-"}${Math.abs(item.amount)}`;
    const titleColor = isCredit ? "text-[#30913F]" : "text-[#DB2626]";
    const cardBg = isCredit
        ? "bg-white dark:bg-gray-800"
        : "bg-[#FFF6F6] dark:bg-red-950/20";

    const content = (
        <>
            <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex items-center gap-1.5">
                    <Image
                        src="/profile/stat-coins.png"
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                    />
                    <span
                        className="text-[11px] font-medium text-[#707784] dark:text-gray-400"
                        style={TAJAWAL}
                    >
                        {item.timeLabel}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                    <SarIcon width={13} height={14} />
                    <span
                        className="text-[15px] font-bold tabular-nums sm:text-[16px]"
                        style={AFACAD}
                    >
                        {amountLabel}
                    </span>
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-end">
                <span
                    className={["text-[13px] font-bold sm:text-[14px]", titleColor].join(
                        " ",
                    )}
                    style={TAJAWAL}
                >
                    {item.title}
                </span>
                <span
                    className="truncate text-[12px] font-medium text-[#111B18] dark:text-gray-100 sm:text-[13px]"
                    style={TAJAWAL}
                >
                    {item.subtitle}
                </span>
            </div>

            <ChevronLeft
                className="h-4 w-4 shrink-0 text-[#C6C8CE] dark:text-gray-500"
                strokeWidth={2}
                aria-hidden
            />
        </>
    );

    const className = [
        "flex w-full items-center gap-3 rounded-[14px] border border-[#F6F5F8] px-3 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.99] dark:border-gray-700 sm:gap-4 sm:px-4",
        cardBg,
    ].join(" ");

    if (item.href) {
        return (
            <button
                type="button"
                onClick={() => router.push(item.href!)}
                className={className}
            >
                {content}
            </button>
        );
    }

    return <div className={className}>{content}</div>;
}
