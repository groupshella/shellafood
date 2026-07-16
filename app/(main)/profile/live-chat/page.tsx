import type { Metadata } from "next";
import { LiveChatClient } from "@/features/profile/components/sections/LiveChat/LiveChatClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "الدردشة الحية | شيلة فود"
			: "Live chat | Shella Food",
		description: isArabic
			? "تواصل مباشرة مع فريق الدعم عبر الدردشة الحية"
			: "Chat directly with the support team",
	};
}

export default async function LiveChatPage() {
	const isArabic = await isArabicLocale();
	return <LiveChatClient isArabic={isArabic} />;
}
