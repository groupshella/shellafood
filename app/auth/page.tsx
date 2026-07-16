import AuthFlowPage from "@/features/auth/components/AuthFlowPage";
import { isArabicLocale } from "@/shared/lib/locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "تسجيل الدخول | شلة فود" : "Sign in | Shella Food",
		description: isArabic
			? "سجّل دخولك أو أنشئ حساباً جديداً للاستمتاع بخدمات شلة فود"
			: "Sign in or create an account to enjoy Shella Food services",
	};
}

export default async function Page() {
	const isArabic = await isArabicLocale();
	return <AuthFlowPage isArabic={isArabic} />;
}
