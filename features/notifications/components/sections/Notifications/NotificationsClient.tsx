"use client";

import { BellOff } from "lucide-react";
import { Notification } from "@/features/notifications/types/notifications.types";
import { NotificationCard } from "./NotificationCard";

interface NotificationsClientProps {
    notifications: Notification[];
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
    return (
        <section aria-label="قائمة الإشعارات" className="space-y-2.5">
            {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
            ))}
        </section>
    );
}


