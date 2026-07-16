import type { PointsHistoryGroup } from "@/features/profile/types/points.types";
import { PointsHistoryEmpty } from "./PointsHistoryEmpty";
import { PointsHistoryItemCard } from "./PointsHistoryItemCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function PointsHistoryList({
	groups,
	isArabic,
}: {
	groups: PointsHistoryGroup[];
	isArabic: boolean;
}) {
	const hasItems = groups.some((g) => g.items.length > 0);

	return (
		<section className="flex w-full flex-col gap-4" aria-labelledby="points-history-title">
			<h2
				id="points-history-title"
				className="text-start text-[16px] font-bold leading-[160%] text-foreground sm:text-[17px]"
				style={TAJAWAL}
			>
				{isArabic ? "تاريخ النقاط" : "Points history"}
			</h2>

			{!hasItems ? (
				<PointsHistoryEmpty isArabic={isArabic} />
			) : (
				<div className="flex flex-col gap-5">
					{groups.map((group) => (
						<div key={group.id} className="flex flex-col gap-2.5">
							<p
								className="text-start text-[13px] font-medium text-muted sm:text-[14px]"
								style={TAJAWAL}
							>
								{group.dateLabel}
							</p>
							<div className="flex flex-col gap-2.5">
								{group.items.map((item) => (
									<PointsHistoryItemCard
										key={item.id}
										item={item}
										isArabic={isArabic}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
