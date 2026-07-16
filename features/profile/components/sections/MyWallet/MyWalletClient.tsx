"use client";

import { useRouter } from "next/navigation";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import type { WalletHistoryGroup } from "@/features/profile/types/wallet.types";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletHistoryList } from "./WalletHistoryList";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

interface MyWalletClientProps {
	balance: number;
	history?: WalletHistoryGroup[];
	isArabic: boolean;
}

export function MyWalletClient({
	balance,
	history = [],
	isArabic,
}: MyWalletClientProps) {
	const router = useRouter();

	return (
		<ProfileSubpageShell
			title={isArabic ? "محفظتي" : "My wallet"}
			isArabic={isArabic}
			relaxedHeader
			showHeaderBorder={false}
			showFooterBorder={false}
			mainClassName="bg-background pb-4"
			footer={
				<div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
					<button
						type="button"
						onClick={() => router.push("/profile/wallet/add")}
						className="flex h-12 w-full items-center justify-center rounded-[12px] bg-brand text-[15px] font-bold text-brand-foreground transition-opacity active:opacity-90 sm:h-[52px] sm:text-[16px]"
						style={TAJAWAL}
					>
						{isArabic ? "أضف رصيد" : "Add balance"}
					</button>
				</div>
			}
		>
			<div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 sm:max-w-md md:max-w-[720px] lg:max-w-3xl">
				<WalletBalanceCard balance={balance} isArabic={isArabic} />
				<WalletHistoryList groups={history} isArabic={isArabic} />
			</div>
		</ProfileSubpageShell>
	);
}
