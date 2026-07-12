"use client";

import { useMemo, useState } from "react";

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
    groups,
}: {
    groups: WalletHistoryGroup[];
}) {
    const [filter, setFilter] = useState<WalletHistoryFilter>("all");

    const visibleGroups = useMemo(() => {
        if (filter === "all") return groups;
        return groups
            .map((g) => ({
                ...g,
                items: g.items.filter((i) => i.transactionType === filter),
            }))
            .filter((g) => g.items.length > 0);
    }, [groups, filter]);
    const hasItems = visibleGroups.some((g) => g.items.length > 0);

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
                    {WALLET_STRINGS.historyTitle}
                </h2>
                <WalletFilterDropdown value={filter} onChange={setFilter} />
            </div>

            {!hasItems ? (
                <WalletHistoryEmpty />
            ) : (
                <div className="flex flex-col gap-5">
                    {visibleGroups.map((group) => (
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
