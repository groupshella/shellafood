import { getNotifications } from "@/features/notifications/api/notifications";
import { NotificationsClient } from "./NotificationsClient";
import NotificationsSkeleton from "./skeleton";
import { NotificationsEmpty } from "./NotificationsEmpty";

export const Notifications = Object.assign(
    async function Notifications() {
        const notifications = await getNotifications();
        if (notifications.length === 0) return <NotificationsEmpty />;

        return <NotificationsClient notifications={notifications} />;
    },
    { skeleton: NotificationsSkeleton }
);
