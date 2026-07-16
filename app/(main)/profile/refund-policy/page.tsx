import { Suspense } from "react";
import type { Metadata } from "next";

import { RefundPolicy } from "@/features/profile/components/sections/StaticContent";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "سياسة استرداد الأموال | شيلة فود" : "Refund policy | Shella Food",
		description: isArabic
			? "سياسة استرداد الأموال في شيلة فود"
			: "Refund policy at Shella Food",
	};
}

export default async function RefundPolicyPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<RefundPolicy.skeleton />}>
			<RefundPolicy isArabic={isArabic} />
		</Suspense>
	);
}
