import { redirect } from "next/navigation";

import { WalletTransferClient } from "@/features/profile/components/sections/MyWallet/WalletTransferClient";
import { getLiveCustomerInfo } from "@/features/profile/api/customer";
import { isArabicLocale } from "@/shared/lib/locale";

export default async function WalletTransferPage() {
	const isArabic = await isArabicLocale();
	const user = await getLiveCustomerInfo(isArabic ? "ar" : "en");
	if (!user) redirect("/auth");

	return (
		<WalletTransferClient
			isArabic={isArabic}
			walletBalance={user.wallet_balance ?? 0}
			qidhaBalance={user.qidha_wallet_balance ?? 0}
			ownPhone={user.phone ?? ""}
		/>
	);
}
