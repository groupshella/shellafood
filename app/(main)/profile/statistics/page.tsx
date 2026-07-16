import { Suspense } from "react";
import type { Metadata } from "next";

import { Statistics } from "@/features/profile/components/sections/Statistics";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "إحصائيات | شيلة فود" : "Statistics | Shella Food",
		description: isArabic
			? "ملخص إنفاقك واتجاهاتك ومنتجاتك الأكثر شراءً"
			: "Your spending summary, trends, and most purchased products",
	};
}

export default async function StatisticsPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<Statistics.skeleton isArabic={isArabic} />}>
			<Statistics isArabic={isArabic} />
		</Suspense>
	);
}
