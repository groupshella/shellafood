import { Suspense } from "react";
import type { Metadata } from "next";

import { AboutUs } from "@/features/profile/components/sections/StaticContent";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "معلومات عنا | شيلة فود" : "About us | Shella Food",
		description: isArabic
			? "تعرّف على شيلة فود ورؤيتنا وخدماتنا"
			: "Learn about Shella Food, our vision, and our services",
	};
}

export default async function AboutUsPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<AboutUs.skeleton />}>
			<AboutUs isArabic={isArabic} />
		</Suspense>
	);
}
