import { POINTS_STRINGS } from "@/features/profile/constants/points.strings";
import type { PointsHistoryGroup } from "@/features/profile/types/points.types";
import { PointsHistoryEmpty } from "./PointsHistoryEmpty";
import { PointsHistoryItemCard } from "./PointsHistoryItemCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function PointsHistoryList({
    groups,
}: {
    groups: PointsHistoryGroup[];
}) {
    const hasItems = groups.some((g) => g.items.length > 0);

    return (
        <section className="flex w-full flex-col gap-4" aria-labelledby="points-history-title">
            <h2
                id="points-history-title"
                className="text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px]"
                style={TAJAWAL}
            >
                {POINTS_STRINGS.historyTitle}
            </h2>

            {!hasItems ? (
                <PointsHistoryEmpty />
            ) : (
                <div className="flex flex-col gap-5">
                    {groups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-2.5">
                            <p
                                className="text-start text-[13px] font-medium text-[#707784] dark:text-gray-400 sm:text-[14px]"
                                style={TAJAWAL}
                            >
                                {group.dateLabel}
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {group.items.map((item) => (
                                    <PointsHistoryItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
