import type { PointsHistoryGroup } from "@/features/profile/types/points.types";
import { PointsHistoryEmpty } from "./PointsHistoryEmpty";
import { PointsHistoryItemCard } from "./PointsHistoryItemCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function PointsHistoryList({
	groups,
	isArabic,
	error,
	isLoading,
	hasMore,
	onRetry,
	onLoadMore,
}: {
	groups: PointsHistoryGroup[];
	isArabic: boolean;
	error: string | null;
	isLoading: boolean;
	hasMore: boolean;
	onRetry: () => void;
	onLoadMore: () => void;
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

			{error && !hasItems ? (
				<div
					className="flex flex-col items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-8 text-center"
					role="alert"
				>
					<p className="text-sm font-medium text-foreground" style={TAJAWAL}>
						{error}
					</p>
					<button
						type="button"
						onClick={onRetry}
						disabled={isLoading}
						className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-50"
					>
						{isLoading
							? isArabic
								? "جاري التحميل..."
								: "Loading..."
							: isArabic
								? "إعادة المحاولة"
								: "Retry"}
					</button>
				</div>
			) : !hasItems && isLoading ? (
				<div className="flex justify-center py-12" role="status">
					<span className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-brand" />
					<span className="sr-only">
						{isArabic ? "جاري تحميل تاريخ النقاط" : "Loading points history"}
					</span>
				</div>
			) : !hasItems ? (
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
					{error && (
						<div className="flex flex-col items-center gap-2 text-center" role="alert">
							<p className="text-sm text-red-500" style={TAJAWAL}>
								{error}
							</p>
							<button
								type="button"
								onClick={onRetry}
								disabled={isLoading}
								className="text-sm font-bold text-brand disabled:opacity-50"
							>
								{isArabic ? "إعادة المحاولة" : "Retry"}
							</button>
						</div>
					)}
					{hasMore && !error && (
						<button
							type="button"
							onClick={onLoadMore}
							disabled={isLoading}
							className="mx-auto min-h-11 rounded-xl border border-brand px-6 py-2.5 text-sm font-bold text-brand disabled:opacity-50"
						>
							{isLoading
								? isArabic
									? "جاري التحميل..."
									: "Loading..."
								: isArabic
									? "تحميل المزيد"
									: "Load more"}
						</button>
					)}
				</div>
			)}
		</section>
	);
}
