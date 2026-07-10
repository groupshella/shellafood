import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsMonthTrend } from "@/features/profile/types/statistics.types";
import { SarIcon } from "../shared/SarIcon";

export function MonthTrendCard({
    trend,
    isEmpty,
}: {
    trend: StatisticsMonthTrend;
    isEmpty: boolean;
}) {
    const total = isEmpty ? "0.00" : trend.total;
    const average = isEmpty ? "0.00" : trend.average;
    const count = isEmpty ? 0 : trend.operationCount;
    const totalColor = total === "0.00" ? "#111B18" : "#30913F";

    return (
        <div className="flex h-[124px] w-[141px] shrink-0 flex-col items-start justify-center gap-1 rounded-[12px] border border-[#F0EEF3] bg-white px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-800">
            <span
                className="text-[13px] font-bold text-[#111B18] dark:text-gray-100"
                style={TAJAWAL}
            >
                {trend.month}
            </span>
            <div className="flex items-center gap-0.5" style={{ color: totalColor }}>
                <SarIcon width={13} height={14.56} />
                <span className="text-[18px] font-bold tabular-nums" style={TAJAWAL}>
                    {total}
                </span>
            </div>
            <span
                className="text-[10px] font-medium text-[#555555] dark:text-gray-400"
                style={TAJAWAL}
            >
                {count} عملية
            </span>
            <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                <span className="text-[10px] font-medium" style={TAJAWAL}>
                    متوسط
                </span>
                <SarIcon width={9.53} height={10.68} />
                <span className="text-[12px] font-semibold tabular-nums" style={TAJAWAL}>
                    {average}
                </span>
            </div>
        </div>
    );
}
