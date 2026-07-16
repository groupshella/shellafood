import { Suspense } from "react";
import type { Metadata } from "next";
import { NotificationsShell } from "@/features/notifications/components/NotificationsShell";
import { Notifications } from "@/features/notifications/components/sections/Notifications";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "الإشعارات | شلة فود" : "Notifications | Shella Food",
		description: isArabic
			? "اطلع على آخر الإشعارات والتحديثات في شلة فود."
			: "See the latest notifications and updates in Shella Food.",
		alternates: {
			canonical: "/notifications",
		},
	};
}

export default async function NotificationsPage() {
	const isArabic = await isArabicLocale();
	if (!(await isAuthenticated())) {
		return <AuthRequiredScreen page="notifications" isArabic={isArabic} />;
	}
	return (
		<NotificationsShell isArabic={isArabic}>
			<Suspense fallback={<Notifications.skeleton />}>
				<Notifications isArabic={isArabic} />
			</Suspense>
		</NotificationsShell>
	);
}
