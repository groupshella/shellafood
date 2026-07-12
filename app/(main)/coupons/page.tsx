import { Suspense } from "react";

import { CouponsShell } from "@/features/coupons/components/CouponsShell";
import { CouponsList } from "@/features/coupons/components/sections/CouponsList";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata = {
	title: "الكوبونات | شيلة فود",
	description: "عرض واستخدام قسائم الخصم المتاحة لحسابك",
};

export default async function CouponsPage() {
	const locale = await getServerLocale()
	const isArabic = locale === "ar";
	return (
		<CouponsShell isArabic={isArabic}>
			<Suspense fallback={<CouponsList.skeleton />}>
				<CouponsList isArabic={isArabic} />
			</Suspense>
		</CouponsShell>
	);
}
