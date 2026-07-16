import type { Metadata } from "next";
import { DeleteAccountClient } from "@/features/profile/components/sections/DeleteAccount/DeleteAccountClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "حذف الحساب | شيلة فود" : "Delete account | Shella Food",
		description: isArabic
			? "حذف حسابك من شيلة فود بشكل نهائي"
			: "Permanently delete your Shella Food account",
	};
}

export default async function DeleteAccountPage() {
	const isArabic = await isArabicLocale();
	return <DeleteAccountClient isArabic={isArabic} />;
}
