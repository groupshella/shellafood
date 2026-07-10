import { TrendingDown, TrendingUp } from "lucide-react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import { SarIcon } from "./shared/SarIcon";

export function StatSpendingCard({
    label,
    amount,
    changePercent,
    hasData,
}: {
    label: string;
    amount: string;
    changePercent: number | null;
    hasData: boolean;
}) {
    const showBadge = hasData && changePercent !== null;
    const isNegative = (changePercent ?? 0) < 0;

    return (
        <div className="flex min-h-[93px] min-w-0 flex-col items-center justify-center gap-[2px] rounded-[8px] bg-[#F6F5F8] dark:bg-gray-800 px-3 py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95 sm:px-[14px]">
            {showBadge && (
                <div
                    className={[
                        "flex h-5 items-center justify-center gap-0.5",
                        isNegative ? "text-[#DB2626]" : "text-[#30913F]",
                    ].join(" ")}
                >
                    <span className="text-[12px] font-medium sm:text-[14px]" style={TAJAWAL}>
                        {Math.abs(changePercent ?? 0).toFixed(1)}%
                    </span>
                    {isNegative ? (
                        <TrendingDown className="h-4 w-4" strokeWidth={2} />
                    ) : (
                        <TrendingUp className="h-4 w-4" strokeWidth={2} />
                    )}
                </div>
            )}
            <p
                className="line-clamp-2 text-center text-[12px] font-medium text-[#111B18] dark:text-gray-100 sm:text-[14px]"
                style={TAJAWAL}
            >
                {label}
            </p>
            <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                <SarIcon width={16} height={17.92} />
                <span
                    className="text-[clamp(18px,5vw,24px)] font-bold leading-8 tabular-nums"
                    style={TAJAWAL}
                >
                    {amount}
                </span>
            </div>
        </div>
    );
}
