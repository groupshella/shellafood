import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsMonthTrend } from "@/features/profile/types/statistics.types";
import { SarIcon } from "../shared/SarIcon";

export function MonthTrendCard({
	trend,
	isEmpty,
	isArabic = true,
}: {
	trend: StatisticsMonthTrend;
	isEmpty: boolean;
	isArabic?: boolean;
}) {
	const total = isEmpty ? "0.00" : trend.total;
	const average = isEmpty ? "0.00" : trend.average;
	const count = isEmpty ? 0 : trend.operationCount;

	return (
		<div className="flex h-[124px] w-full max-w-[141px] shrink-0 flex-col items-start justify-center gap-1 rounded-[12px] border border-border bg-background px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] md:max-w-[160px] lg:max-w-[180px]">
			<span
				className="text-[13px] font-bold text-foreground"
				style={TAJAWAL}
			>
				{trend.month}
			</span>
			<div
				className={[
					"flex items-center gap-0.5",
					total === "0.00" ? "text-foreground" : "text-brand",
				].join(" ")}
			>
				<SarIcon width={13} height={14.56} />
				<span
					className="text-[18px] font-bold tabular-nums"
					style={TAJAWAL}
				>
					{total}
				</span>
			</div>
			<span
				className="text-[10px] font-medium text-muted"
				style={TAJAWAL}
			>
				{count} {isArabic ? "عملية" : "ops"}
			</span>
			<div className="flex items-center gap-1 text-foreground">
				<span className="text-[10px] font-medium" style={TAJAWAL}>
					{isArabic ? "متوسط" : "avg"}
				</span>
				<SarIcon width={9.53} height={10.68} />
				<span
					className="text-[12px] font-semibold tabular-nums"
					style={TAJAWAL}
				>
					{average}
				</span>
			</div>
		</div>
	);
}
