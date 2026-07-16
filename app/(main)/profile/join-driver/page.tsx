import type { Metadata } from "next";
import { JoinDriverClient } from "@/features/profile/components/sections/JoinDriver/JoinDriverClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "انضم كرجل توصيل | شيلة فود"
			: "Join as a delivery driver | Shella Food",
		description: isArabic
			? "قدّم طلب الانضمام كسائق توصيل مع شيلة فود"
			: "Apply to join as a delivery driver with Shella Food",
	};
}

export default async function JoinDriverPage() {
	const isArabic = await isArabicLocale();
	return <JoinDriverClient isArabic={isArabic} />;
}
