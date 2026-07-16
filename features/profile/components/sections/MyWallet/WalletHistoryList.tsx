"use client";

import { useEffect, useState, useTransition } from "react";

import { WALLET_STRINGS } from "@/features/profile/constants/wallet.strings";
import type {
    WalletHistoryFilter,
    WalletHistoryGroup,
} from "@/features/profile/types/wallet.types";
import { WalletFilterDropdown } from "./WalletFilterDropdown";
import { WalletHistoryEmpty } from "./WalletHistoryEmpty";
import { WalletHistoryItemCard } from "./WalletHistoryItemCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function WalletHistoryList({
    groups: initialGroups,
    isArabic = true,
}: {
    groups: WalletHistoryGroup[];
    isArabic?: boolean;
}) {
    const [filter, setFilter] = useState<WalletHistoryFilter>("all");
    const [groups, setGroups] = useState(initialGroups);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setGroups(initialGroups);
    }, [initialGroups]);

    function handleFilterChange(next: WalletHistoryFilter) {
        setFilter(next);
        startTransition(async () => {
            try {
                const params = new URLSearchParams({
                    offset: "0",
                    limit: "10",
                    type: next,
                });
                const res = await fetch(
                    `/api/profile/wallet/transactions?${params}`,
                );
                const json = await res.json();
                if (!res.ok || !json.success) {
                    setGroups([]);
                    return;
                }
                setGroups(
                    Array.isArray(json.data) ? json.data : [],
                );
            } catch {
                setGroups([]);
            }
        });
    }

    const hasItems = groups.some((g) => g.items.length > 0);

    return (
        <section
            className="flex w-full flex-1 flex-col gap-4"
            aria-labelledby="wallet-history-title"
        >
            <div className="flex items-center justify-between gap-3">
                <h2
                    id="wallet-history-title"
                    className="text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px]"
                    style={TAJAWAL}
                >
                    {isArabic
                        ? WALLET_STRINGS.historyTitle.ar
                        : WALLET_STRINGS.historyTitle.en}
                </h2>
                <WalletFilterDropdown
                    value={filter}
                    onChange={handleFilterChange}
                    isArabic={isArabic}
                />
            </div>

            {isPending ? (
                <div
                    className="py-8 text-center text-[13px] text-[#707784] dark:text-gray-400"
                    style={TAJAWAL}
                >
                    جاري التحميل...
                </div>
            ) : !hasItems ? (
                <WalletHistoryEmpty isArabic={isArabic} />
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
                                    <WalletHistoryItemCard
                                        key={item.id}
                                        item={item}
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
