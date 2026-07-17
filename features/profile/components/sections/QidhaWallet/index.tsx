import { getQidhaWallet } from "@/features/profile/api/qidha";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { QidhaWalletClient } from "./QidhaWalletClient";
import { QidhaLoadError } from "./QidhaLoadError";
import QidhaWalletSkeleton from "./skeleton";

export const QidhaWallet = Object.assign(
	async function QidhaWallet({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		const user = await getProfileUser();
		if (!user) redirect("/auth");

		const apiData = await getQidhaWallet(user.id, lang);

		if (!apiData && !user.qidha_wallet_active) {
			redirect("/profile/wallet-subscription");
		}
		if (!apiData) return <QidhaLoadError isArabic={isArabic} />;

		return (
			<QidhaWalletClient
				card={apiData.card}
				fullAmountDue={apiData.fullAmountDue}
				minimumAmountDue={apiData.minimumAmountDue}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: QidhaWalletSkeleton },
);
