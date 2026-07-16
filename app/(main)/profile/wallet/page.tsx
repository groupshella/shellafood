import { Suspense } from "react";
import type { Metadata } from "next";

import { MyWallet } from "@/features/profile/components/sections/MyWallet";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "محفظتي | شيلة فود" : "My wallet | Shella Food",
		description: isArabic
			? "رصيد محفظتك وتاريخ المعاملات"
			: "Your wallet balance and transaction history",
	};
}

export default async function MyWalletPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<MyWallet.skeleton />}>
			<MyWallet isArabic={isArabic} />
		</Suspense>
	);
}
