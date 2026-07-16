import { getWalletTransactions } from "@/features/profile/api/wallet";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyWalletClient } from "./MyWalletClient";
import MyWalletSkeleton from "./skeleton";

export const MyWallet = Object.assign(
	async function MyWallet({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		const [user, history] = await Promise.all([
			getProfileUser(),
			getWalletTransactions(0, 10, "all", lang),
		]);
		if (!user) redirect("/auth");

		return (
			<MyWalletClient
				balance={user.wallet_balance ?? 0}
				history={history}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: MyWalletSkeleton },
);
