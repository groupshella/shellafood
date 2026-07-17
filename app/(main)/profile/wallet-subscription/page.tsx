import type { Metadata } from "next";
import { WalletSubscriptionClient } from "@/features/profile/components/sections/WalletSubscription/WalletSubscriptionClient";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { isArabicLocale } from "@/shared/lib/locale";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "اشتراك المحفظة | شيلة فود"
			: "Wallet subscription | Shella Food",
		description: isArabic
			? "اشترك في محفظة شيلة فود وفعّل مزايا الرصيد"
			: "Subscribe to the Shella Food wallet and activate balance features",
	};
}

export default async function WalletSubscriptionPage() {
	const [isArabic, user] = await Promise.all([isArabicLocale(), getProfileUser()]);
	if (!user) redirect("/auth");
	if (user.qidha_wallet_active) redirect("/profile/qidha");

	return (
		<WalletSubscriptionClient
			isArabic={isArabic}
			userId={user.id}
			initialStep={user.qidha_wallet_signed ? "pending" : "personal-info"}
		/>
	);
}
