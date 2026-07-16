import type { Metadata } from "next";
import { HelpSupportClient } from "@/features/profile/components/sections/HelpSupport/HelpSupportClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "المساعدة والدعم | شيلة فود"
			: "Help & support | Shella Food",
		description: isArabic
			? "تواصل مع الدعم الفني واحصل على المساعدة"
			: "Contact technical support and get help",
	};
}

export default async function HelpSupportPage() {
	const isArabic = await isArabicLocale();
	return <HelpSupportClient isArabic={isArabic} />;
}
