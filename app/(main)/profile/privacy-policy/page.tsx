import { Suspense } from "react";
import type { Metadata } from "next";

import { PrivacyPolicy } from "@/features/profile/components/sections/StaticContent";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "الخصوصية | شيلة فود" : "Privacy | Shella Food",
		description: isArabic
			? "سياسة الخصوصية وحماية بياناتك في شيلة فود"
			: "Privacy policy and how Shella Food protects your data",
	};
}

export default async function PrivacyPolicyPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<PrivacyPolicy.skeleton />}>
			<PrivacyPolicy isArabic={isArabic} />
		</Suspense>
	);
}
