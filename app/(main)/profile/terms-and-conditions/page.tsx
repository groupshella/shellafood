import { Suspense } from "react";
import type { Metadata } from "next";

import { TermsAndConditions } from "@/features/profile/components/sections/StaticContent";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "الشروط والأحكام | شيلة فود" : "Terms and conditions | Shella Food",
		description: isArabic
			? "الشروط والأحكام لاستخدام منصة شيلة فود"
			: "Terms and conditions for using the Shella Food platform",
	};
}

export default async function TermsAndConditionsPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<TermsAndConditions.skeleton />}>
			<TermsAndConditions isArabic={isArabic} />
		</Suspense>
	);
}
