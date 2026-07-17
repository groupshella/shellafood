"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { refreshCustomerInfo } from "@/features/profile/actions/profile.actions";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import type {
	PointsHistoryGroup,
	PointsTransactionsPage,
} from "@/features/profile/types/points.types";
import type { ApiResponse } from "@/shared/lib/api-response";
import { useNotification } from "@/shared/components/NotificationToast";
import { PointsHistoryList } from "./PointsHistoryList";
import { PointsSummaryCard } from "./PointsSummaryCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

interface MyPointsClientProps {
	convertiblePoints: number;
	initialPage: PointsTransactionsPage;
	initialHistoryError: string | null;
	isArabic: boolean;
}

function mergeGroups(
	current: PointsHistoryGroup[],
	incoming: PointsHistoryGroup[],
): PointsHistoryGroup[] {
	const merged = current.map((group) => ({
		...group,
		items: [...group.items],
	}));
	const byId = new Map(merged.map((group) => [group.id, group]));

	for (const group of incoming) {
		const existing = byId.get(group.id);
		if (!existing) {
			const next = { ...group, items: [...group.items] };
			merged.push(next);
			byId.set(next.id, next);
			continue;
		}

		const itemIds = new Set(existing.items.map((item) => item.id));
		existing.items.push(
			...group.items.filter((item) => !itemIds.has(item.id)),
		);
	}

	return merged;
}

export function MyPointsClient({
	convertiblePoints,
	initialPage,
	initialHistoryError,
	isArabic,
}: MyPointsClientProps) {
	const lang = isArabic ? "ar" : "en";
	const [isPending, startTransition] = useTransition();
	const [points, setPoints] = useState(convertiblePoints);
	const [groups, setGroups] = useState(initialPage.groups);
	const [nextOffset, setNextOffset] = useState(initialPage.nextOffset);
	const [hasMore, setHasMore] = useState(initialPage.hasMore);
	const [historyError, setHistoryError] = useState(initialHistoryError);
	const [isHistoryLoading, setIsHistoryLoading] = useState(false);
	const [failedOffset, setFailedOffset] = useState(
		initialHistoryError ? 0 : null,
	);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const router = useRouter();
	const { success, error } = useNotification();

	async function fetchHistory(offset: number, replace = false) {
		setIsHistoryLoading(true);
		setHistoryError(null);
		try {
			const res = await fetch(
				`/api/profile/points/transactions?offset=${offset}`,
				{
					headers: {
						"Accept-Language": lang,
						lang,
					},
					cache: "no-store",
				},
			);
			const json = (await res.json()) as ApiResponse<PointsTransactionsPage>;
			if (!res.ok || !json.success) {
				throw new Error(
					json.success
						? isArabic
							? "تعذر تحميل تاريخ النقاط"
							: "Could not load points history"
						: json.message,
				);
			}

			setGroups((current) =>
				replace ? json.data.groups : mergeGroups(current, json.data.groups),
			);
			setNextOffset(json.data.nextOffset);
			setHasMore(json.data.hasMore);
			setFailedOffset(null);
		} catch (cause) {
			setFailedOffset(offset);
			setHistoryError(
				cause instanceof Error
					? cause.message
					: isArabic
						? "تعذر تحميل تاريخ النقاط"
						: "Could not load points history",
			);
		} finally {
			setIsHistoryLoading(false);
		}
	}

	function handleOpenConfirmation() {
		startTransition(async () => {
			const refreshed = await refreshCustomerInfo(lang);
			if (!refreshed.success) {
				error(refreshed.message);
				return;
			}

			const available = Number(refreshed.user.loyalty_point ?? 0);
			setPoints(available);
			if (!Number.isFinite(available) || available <= 0) {
				error(
					isArabic
						? "لا توجد نقاط متاحة للتحويل"
						: "No points are available to convert",
				);
				return;
			}
			setShowConfirmation(true);
		});
	}

	function handleConvert() {
		setShowConfirmation(false);
		startTransition(async () => {
			const refreshedBeforeTransfer = await refreshCustomerInfo(lang);
			if (!refreshedBeforeTransfer.success) {
				error(refreshedBeforeTransfer.message);
				return;
			}

			const available = Number(
				refreshedBeforeTransfer.user.loyalty_point ?? 0,
			);
			setPoints(available);
			if (!Number.isFinite(available) || available <= 0) {
				error(
					isArabic
						? "لا توجد نقاط متاحة للتحويل"
						: "No points are available to convert",
				);
				return;
			}
			if (available !== points) {
				error(
					isArabic
						? "تم تحديث رصيد نقاطك، يرجى تأكيد التحويل مرة أخرى"
						: "Your points balance changed. Please confirm again",
				);
				return;
			}

			try {
				const res = await fetch("/api/profile/points/convert", {
					method: "POST",
					headers: {
						"Content-Type": "application/json; charset=UTF-8",
						"Accept-Language": lang,
						lang,
					},
					body: JSON.stringify({ point: available }),
				});
				const json = await res.json();
				if (!res.ok || !json.success) {
					throw new Error(
						json?.message ??
							(isArabic
								? "فشل في تحويل النقاط"
								: "Failed to convert points"),
					);
				}

				const refreshedAfterTransfer = await refreshCustomerInfo(lang);
				if (refreshedAfterTransfer.success) {
					setPoints(
						Number(refreshedAfterTransfer.user.loyalty_point ?? 0),
					);
				}
				await fetchHistory(0, true);
				router.refresh();
				success(
					isArabic
						? "تم تحويل النقاط إلى المحفظة بنجاح"
						: "Points converted to wallet successfully",
				);
			} catch (cause) {
				error(
					cause instanceof Error
						? cause.message
						: isArabic
							? "فشل في تحويل النقاط"
							: "Failed to convert points",
				);
			}
		});
	}

	return (
		<ProfileSubpageShell
			title={isArabic ? "نقاطي" : "My points"}
			isArabic={isArabic}
			relaxedHeader
			showHeaderBorder={false}
			showFooterBorder={false}
			mainClassName="bg-background pb-4"
			footer={
				<div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
					<button
						type="button"
						disabled={points <= 0 || isPending}
						onClick={handleOpenConfirmation}
						className="flex h-12 w-full items-center justify-center rounded-[12px] bg-brand text-[15px] font-bold text-brand-foreground transition-opacity enabled:active:opacity-90 disabled:opacity-50 sm:h-[52px] sm:text-[16px]"
						style={TAJAWAL}
					>
						{isPending
							? isArabic
								? "جاري التحويل..."
								: "Converting..."
							: isArabic
								? "تحويل إلى محفظة المال"
								: "Convert to wallet"}
					</button>
				</div>
			}
		>
			<div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 sm:max-w-md md:max-w-[720px] lg:max-w-3xl">
				<PointsSummaryCard points={points} isArabic={isArabic} />
				<PointsHistoryList
					groups={groups}
					isArabic={isArabic}
					error={historyError}
					isLoading={isHistoryLoading}
					hasMore={hasMore}
					onRetry={() => fetchHistory(failedOffset ?? 0, failedOffset === 0)}
					onLoadMore={() => fetchHistory(nextOffset)}
				/>
			</div>
			<CheckoutBottomSheet
				isOpen={showConfirmation}
				isVisible={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				ariaLabel={
					isArabic ? "تأكيد تحويل النقاط" : "Confirm points conversion"
				}
				isArabic={isArabic}
			>
				<div className="mx-auto w-full max-w-md px-2 pb-6 pt-2">
					<h2 className="mb-2 text-center text-lg font-bold text-foreground">
						{isArabic ? "تأكيد تحويل النقاط" : "Confirm conversion"}
					</h2>
					<p className="mb-6 text-center text-sm text-muted">
						{isArabic
							? `هل تريد تحويل ${points} نقطة إلى محفظة المال؟`
							: `Convert ${points} points to your wallet?`}
					</p>
					<div className="flex flex-col gap-3">
						<PrimaryButton onClick={handleConvert} disabled={isPending}>
							{isArabic ? "نعم، تحويل النقاط" : "Yes, convert points"}
						</PrimaryButton>
						<PrimaryButton
							variant="danger-muted"
							className="bg-card text-foreground"
							onClick={() => setShowConfirmation(false)}
							disabled={isPending}
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</PrimaryButton>
					</div>
				</div>
			</CheckoutBottomSheet>
		</ProfileSubpageShell>
	);
}
