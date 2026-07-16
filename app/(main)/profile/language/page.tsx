import type { Metadata } from "next";
import { LanguageClient } from "@/features/profile/components/sections/Language/LanguageClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "اللغة | شيلة فود" : "Language | Shella Food",
		description: isArabic
			? "اختر لغة التطبيق"
			: "Choose the app language",
	};
}

export default async function LanguagePage() {
	const isArabic = await isArabicLocale();
	return <LanguageClient isArabic={isArabic} />;
}
