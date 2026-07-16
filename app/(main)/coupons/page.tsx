import { Suspense } from "react";
import type { Metadata } from "next";

import { CouponsShell } from "@/features/coupons/components/CouponsShell";
import { CouponsList } from "@/features/coupons/components/sections/CouponsList";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "الكوبونات | شيلة فود" : "Coupons | Shella Food",
		description: isArabic
			? "عرض واستخدام قسائم الخصم المتاحة لحسابك"
			: "View and use the discount coupons available on your account",
	};
}

export default async function CouponsPage() {
	const isArabic = await isArabicLocale();

	return (
		<CouponsShell isArabic={isArabic}>
			<Suspense fallback={<CouponsList.skeleton />}>
				<CouponsList isArabic={isArabic} />
			</Suspense>
		</CouponsShell>
	);
}
