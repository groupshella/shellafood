"use client";

import { Notification } from "@/features/notifications/types/notifications.types";
import { NotificationCard } from "./NotificationCard";

const NOTIFICATIONS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";

interface NotificationsClientProps {
    notifications: Notification[];
    isArabic: boolean;
}

export function NotificationsClient({ notifications, isArabic }: NotificationsClientProps) {
    return (
        <section aria-label={isArabic ? "قائمة الإشعارات" : "Notifications list"} className={NOTIFICATIONS_GRID}>
            {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} isArabic={isArabic} />
            ))}
        </section>
    );
}
