import OnboardingScreens from "@/features/onboarding/OnboardingScreens";
import { isArabicLocale } from "@/shared/lib/locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "مرحباً بك | شلة فود" : "Welcome | Shella Food",
		description: isArabic
			? "تعرّف على شلة فود واكتشف خدمات التوصيل والطلبات المتنوعة"
			: "Discover Shella Food and explore delivery and ordering services",
	};
}

export default async function OnboardingPage() {
	const isArabic = await isArabicLocale();
	return <OnboardingScreens isArabic={isArabic} />;
}
