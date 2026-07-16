import { Suspense } from "react";
import type { Metadata } from "next";

import { MyPoints } from "@/features/profile/components/sections/MyPoints";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "نقاطي | شيلة فود" : "My points | Shella Food",
		description: isArabic
			? "نقاطك القابلة للتحويل وتاريخ النقاط"
			: "Your convertible points and points history",
	};
}

export default async function MyPointsPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<MyPoints.skeleton />}>
			<MyPoints isArabic={isArabic} />
		</Suspense>
	);
}
