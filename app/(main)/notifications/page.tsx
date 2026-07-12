import { Suspense } from "react";
import type { Metadata } from "next";
import { NotificationsShell } from "@/features/notifications/components/NotificationsShell";
import { Notifications } from "@/features/notifications/components/sections/Notifications";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
	title: "الإشعارات | شلة فود",
	description: "اطلع على آخر الإشعارات والتحديثات في شلة فود.",
	alternates: {
		canonical: "/notifications",
	},
};

export default async function NotificationsPage() {
	if (!(await isAuthenticated())) {
		return <AuthRequiredScreen page="notifications" />;
	}
	const locale = await getServerLocale()
	const isArabic = locale === "ar";
	return (
		<NotificationsShell isArabic={isArabic}>
			<Suspense fallback={<Notifications.skeleton />}>
				<Notifications isArabic={isArabic} />
			</Suspense>
		</NotificationsShell>
	);
}
