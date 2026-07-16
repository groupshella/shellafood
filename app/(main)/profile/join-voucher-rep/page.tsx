import type { Metadata } from "next";
import { JoinVoucherRepClient } from "@/features/profile/components/sections/JoinVoucherRep/JoinVoucherRepClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "مندوب قسائم شرائية | شيلة فود"
			: "Voucher marketing rep | Shella Food",
		description: isArabic
			? "انضم كمندوب تسويق قسائم شرائية مع شيلة فود"
			: "Join as a voucher marketing representative with Shella Food",
	};
}

export default async function JoinVoucherRepPage() {
	const isArabic = await isArabicLocale();
	return <JoinVoucherRepClient isArabic={isArabic} />;
}
