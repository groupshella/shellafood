"use client";

import { ChevronLeft } from "lucide-react";
import Image from "@/shared/components/SecureImage";
import { useRouter } from "next/navigation";

import type { PointsHistoryItem } from "@/features/profile/types/points.types";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function PointsHistoryItemCard({
	item,
	isArabic,
}: {
	item: PointsHistoryItem;
	isArabic: boolean;
}) {
	const router = useRouter();
	const pointsLabel = item.points > 0 ? `+${item.points}` : String(item.points);

	const content = (
		<>
			<div className="flex shrink-0 flex-col items-start gap-1">
				<span className="text-[11px] font-medium text-muted" style={TAJAWAL}>
					{item.timeLabel}
				</span>
				<div className="flex items-center gap-1 text-foreground">
					<Image
						src="/profile/stat-coins.png"
						alt=""
						width={18}
						height={18}
						className="h-[18px] w-[18px] object-contain"
					/>
					<span
						className="text-[15px] font-bold tabular-nums sm:text-[16px]"
						style={AFACAD}
					>
						{pointsLabel}
					</span>
				</div>
			</div>

			<div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-end">
				<span
					className="text-[13px] font-bold text-brand sm:text-[14px]"
					style={TAJAWAL}
				>
					{item.title}
				</span>
				<span
					className="truncate text-[12px] font-medium text-foreground sm:text-[13px]"
					style={TAJAWAL}
				>
					{item.subtitle}
				</span>
			</div>

			<ChevronLeft
				className={`h-4 w-4 shrink-0 text-muted ${isArabic ? "" : "rotate-180"}`}
				strokeWidth={2}
				aria-hidden
			/>
		</>
	);

	const className =
		"flex w-full items-center gap-3 rounded-[14px] border border-border bg-card px-3 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.99] sm:gap-4 sm:px-4";

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
