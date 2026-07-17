import {
	getWalletBonuses,
	getWalletTransactions,
} from "@/features/profile/api/wallet";
import { getLiveCustomerInfo } from "@/features/profile/api/customer";
import { redirect } from "next/navigation";

import { MyWalletClient } from "./MyWalletClient";
import MyWalletSkeleton from "./skeleton";

export const MyWallet = Object.assign(
	async function MyWallet({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		const [user, history, bonuses] = await Promise.all([
			getLiveCustomerInfo(lang),
			getWalletTransactions(0, 10, "all", lang),
			getWalletBonuses(lang),
		]);
		if (!user) redirect("/auth");

		return (
			<MyWalletClient
				balance={user.wallet_balance ?? 0}
				history={history}
				bonuses={bonuses}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: MyWalletSkeleton },
);
