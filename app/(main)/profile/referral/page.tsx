import { Suspense } from "react";
import type { Metadata } from "next";

import { InviteFriends } from "@/features/profile/components/sections/InviteFriends";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "دعوة الأصدقاء | شيلة فود"
			: "Invite friends | Shella Food",
		description: isArabic
			? "ادعُ أصدقاءك واكسب نقاط ومكافآت مع شيلة فود"
			: "Invite friends and earn points and rewards with Shella Food",
	};
}

export default async function ReferralPage() {
	const isArabic = await isArabicLocale();

	return (
		<Suspense fallback={<InviteFriends.skeleton isArabic={isArabic} />}>
			<InviteFriends isArabic={isArabic} />
		</Suspense>
	);
}
