"use client";

import { useEffect, useState } from "react";

import { WALLET_STRINGS } from "@/features/profile/constants/wallet.strings";
import type {
	WalletHistoryFilter,
	WalletHistoryGroup,
} from "@/features/profile/types/wallet.types";
import { WalletFilterDropdown } from "./WalletFilterDropdown";
import { WalletHistoryEmpty } from "./WalletHistoryEmpty";
import { WalletHistoryItemCard } from "./WalletHistoryItemCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const PAGE_SIZE = 10;

interface HistoryState {
	groups: WalletHistoryGroup[];
	offset: number;
	hasMore: boolean;
	loading: boolean;
	error: string | null;
}

function itemCount(groups: WalletHistoryGroup[]) {
	return groups.reduce((total, group) => total + group.items.length, 0);
}

function mergeGroups(
	current: WalletHistoryGroup[],
	incoming: WalletHistoryGroup[],
): WalletHistoryGroup[] {
	const merged = new Map(current.map((group) => [group.id, { ...group, items: [...group.items] }]));
	for (const group of incoming) {
		const existing = merged.get(group.id);
		if (!existing) {
			merged.set(group.id, { ...group, items: [...group.items] });
			continue;
		}
		const ids = new Set(existing.items.map((item) => item.id));
		existing.items.push(...group.items.filter((item) => !ids.has(item.id)));
	}
	return Array.from(merged.values());
}

export function WalletHistoryList({
	groups: initialGroups,
	bonuses = [],
	isArabic = true,
}: {
	groups: WalletHistoryGroup[];
	bonuses?: WalletHistoryGroup[];
	isArabic?: boolean;
}) {
	const initialState: HistoryState = {
		groups: initialGroups,
		offset: 0,
		hasMore: itemCount(initialGroups) === PAGE_SIZE,
		loading: false,
		error: null,
	};
	const [filter, setFilter] = useState<WalletHistoryFilter>("all");
	const [states, setStates] = useState<Partial<Record<WalletHistoryFilter, HistoryState>>>({
		all: initialState,
	});

	useEffect(() => {
		setStates((current) => ({ ...current, all: initialState }));
		// Initial server data changes only after a route refresh.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialGroups]);

	const state = states[filter] ?? {
		groups: [],
		offset: 0,
		hasMore: true,
		loading: false,
		error: null,
	};

	async function load(nextFilter: WalletHistoryFilter, offset: number, append: boolean) {
		setStates((current) => ({
			...current,
			[nextFilter]: {
				...(current[nextFilter] ?? {
					groups: [],
					offset: 0,
					hasMore: true,
				}),
				loading: true,
				error: null,
			},
		}));
		try {
			const params = new URLSearchParams({
				offset: String(offset),
				limit: String(PAGE_SIZE),
				type: nextFilter,
			});
			const response = await fetch(`/api/profile/wallet/transactions?${params}`, {
				headers: { lang: isArabic ? "ar" : "en" },
			});
			const json = await response.json();
			if (!response.ok || !json.success) throw new Error(json?.message);
			const incoming = Array.isArray(json.data) ? json.data : [];
			setStates((current) => ({
				...current,
				[nextFilter]: {
					groups: append
						? mergeGroups(current[nextFilter]?.groups ?? [], incoming)
						: incoming,
					offset,
					hasMore: itemCount(incoming) === PAGE_SIZE,
					loading: false,
					error: null,
				},
			}));
		} catch {
			setStates((current) => ({
				...current,
				[nextFilter]: {
					...(current[nextFilter] ?? {
						groups: [],
						hasMore: true,
					}),
					offset,
					loading: false,
					error: isArabic
						? "تعذر تحميل سجل المحفظة"
						: "Could not load wallet history",
				},
			}));
		}
	}

	function handleFilterChange(next: WalletHistoryFilter) {
		setFilter(next);
		if (!states[next]) void load(next, 0, false);
	}

	const hasItems = state.groups.some((group) => group.items.length > 0);

	return (
		<div className="flex flex-col gap-6">
			{itemCount(bonuses) > 0 && (
				<section className="flex flex-col gap-3" aria-labelledby="wallet-bonuses-title">
					<h2 id="wallet-bonuses-title" className="text-start text-[16px] font-bold" style={TAJAWAL}>
						{isArabic ? "مكافآت المحفظة" : "Wallet bonuses"}
					</h2>
					{bonuses.flatMap((group) =>
						group.items.map((item) => <WalletHistoryItemCard key={item.id} item={item} />),
					)}
				</section>
			)}

			<section className="flex w-full flex-1 flex-col gap-4" aria-labelledby="wallet-history-title">
				<div className="flex items-center justify-between gap-3">
					<h2 id="wallet-history-title" className="text-start text-[16px] font-bold" style={TAJAWAL}>
						{isArabic ? WALLET_STRINGS.historyTitle.ar : WALLET_STRINGS.historyTitle.en}
					</h2>
					<WalletFilterDropdown value={filter} onChange={handleFilterChange} isArabic={isArabic} />
				</div>

				{state.loading && !hasItems ? (
					<p className="py-8 text-center text-[13px] text-[#707784]" style={TAJAWAL}>
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				) : state.error && !hasItems ? (
					<div className="flex flex-col items-center gap-3 py-8">
						<p className="text-[13px] text-red-600">{state.error}</p>
						<button type="button" onClick={() => void load(filter, state.offset, false)} className="rounded-lg border px-4 py-2 text-sm font-bold">
							{isArabic ? "إعادة المحاولة" : "Retry"}
						</button>
					</div>
				) : !hasItems ? (
					<WalletHistoryEmpty isArabic={isArabic} />
				) : (
					<div className="flex flex-col gap-5">
						{state.groups.map((group) => (
							<div key={group.id} className="flex flex-col gap-2.5">
								<p className="text-start text-[13px] text-[#707784]" style={TAJAWAL}>{group.dateLabel}</p>
								{group.items.map((item) => <WalletHistoryItemCard key={item.id} item={item} />)}
							</div>
						))}
						{state.error && <p className="text-center text-sm text-red-600">{state.error}</p>}
						{(state.hasMore || state.error) && (
							<button
								type="button"
								disabled={state.loading}
								onClick={() =>
									void load(
										filter,
										state.error ? state.offset : state.offset + PAGE_SIZE,
										state.error ? state.offset > 0 : true,
									)
								}
								className="h-11 rounded-[10px] border border-brand text-sm font-bold text-brand disabled:opacity-50"
							>
								{state.loading
									? isArabic ? "جاري التحميل..." : "Loading..."
									: state.error
										? isArabic ? "إعادة المحاولة" : "Retry"
										: isArabic ? "تحميل المزيد" : "Load more"}
							</button>
						)}
					</div>
				)}
			</section>
		</div>
	);
}
