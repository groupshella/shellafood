"use client";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/features/language/useLanguage";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import type { WalletHistoryGroup } from "@/features/profile/types/wallet.types";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletHistoryList } from "./WalletHistoryList";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

interface MyWalletClientProps {
    balance: number;
    history?: WalletHistoryGroup[];
}

export function MyWalletClient({
    balance,
    history = [],
}: MyWalletClientProps) {
    const { isArabic } = useLanguage();
    const router = useRouter();

    return (
        <ProfileSubpageShell
            title={isArabic ? "محفظتي" : "My wallet"}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="bg-white dark:bg-gray-950 pb-4"
            footer={
                <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        onClick={() => router.push("/profile/wallet/add")}
                        className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#30913F] text-[15px] font-bold text-white transition-opacity active:opacity-90 sm:h-[52px] sm:text-[16px]"
                        style={TAJAWAL}
                    >
                        {isArabic ? "أضف رصيد" : "Add balance"}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 md:max-w-[720px]">
                <WalletBalanceCard balance={balance} />
                <WalletHistoryList groups={history} />
            </div>
        </ProfileSubpageShell>
    );
}
