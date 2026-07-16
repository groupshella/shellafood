import type { Metadata } from "next";
import { WalletSubscriptionClient } from "@/features/profile/components/sections/WalletSubscription/WalletSubscriptionClient";
import { isArabicLocale } from "@/shared/lib/locale";

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
	const isArabic = await isArabicLocale();
	return <WalletSubscriptionClient isArabic={isArabic} />;
}
