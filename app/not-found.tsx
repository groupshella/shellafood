import type { Metadata } from "next";
import { NotFoundContent } from "./NotFoundContent";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "الصفحة غير موجودة | شلة فود"
			: "Page not found | Shella Food",
		description: isArabic
			? "لم نتمكن من العثور على الصفحة المطلوبة. عد إلى الرئيسية أو ابحث في شلة فود."
			: "We couldn't find the page you requested. Go home or search on Shella Food.",
		robots: { index: false, follow: false },
	};
}

export default async function NotFound() {
	const isArabic = await isArabicLocale();
	return <NotFoundContent isArabic={isArabic} />;
}
