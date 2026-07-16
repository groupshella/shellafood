import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsCategory } from "@/features/profile/types/statistics.types";

export function CategoryCard({
	category,
	isArabic = true,
}: {
	category: StatisticsCategory;
	isArabic?: boolean;
}) {
	return (
		<div className="flex min-h-[72px] w-full items-center justify-between gap-3 rounded-[14px] border border-border bg-background px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:min-h-20 sm:px-4">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<div className="h-11 w-11 shrink-0 rounded-[12px] bg-card sm:h-12 sm:w-12" />
				<div className="flex min-w-0 flex-col items-start gap-0.5">
					<span
						className="w-full truncate text-start text-[14px] font-bold text-foreground sm:text-[15px]"
						style={TAJAWAL}
					>
						{category.name}
					</span>
					<span
						className="text-[11px] font-medium text-muted sm:text-xs"
						style={TAJAWAL}
					>
						{category.purchaseCount}{" "}
						{isArabic ? "عملية شراء" : "purchases"}
					</span>
				</div>
			</div>
			<div className="flex shrink-0 flex-col items-end">
				<span
					className="text-[15px] font-bold tabular-nums text-foreground sm:text-base"
					style={TAJAWAL}
				>
					{category.amount}
				</span>
				<span
					className="text-[12px] font-medium text-muted"
					style={TAJAWAL}
				>
					{category.percentage}
				</span>
			</div>
		</div>
	);
}
