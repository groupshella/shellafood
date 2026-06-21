import { Suspense } from "react";
import type { Metadata } from "next";
import { NotificationsShell } from "@/features/notifications/components/NotificationsShell";
import { Notifications } from "@/features/notifications/components/sections/Notifications";

export const metadata: Metadata = {
	title: "الإشعارات | شلة فود",
	description: "اطلع على آخر الإشعارات والتحديثات في شلة فود.",
	alternates: {
		canonical: "/notifications",
	},
};

export default function NotificationsPage() {
	return (
		<NotificationsShell>
			<Suspense fallback={<Notifications.skeleton />}>
				<Notifications />
			</Suspense>
		</NotificationsShell>
	);
}
