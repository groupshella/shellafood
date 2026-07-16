import { Suspense } from "react";
import type { Metadata } from "next";

import { QidhaWallet } from "@/features/profile/components/sections/QidhaWallet";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "محفظة قيدها | شيلة فود" : "Qidha wallet | Shella Food",
		description: isArabic
			? "رصيد محفظة قيدها وخيارات الدفع"
			: "Qidha wallet balance and payment options",
	};
}

export default async function QidhaWalletPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<QidhaWallet.skeleton />}>
			<QidhaWallet isArabic={isArabic} />
		</Suspense>
	);
}
