import { getNotifications } from "@/features/notifications/api/notifications";
import { NotificationsClient } from "./NotificationsClient";
import NotificationsSkeleton from "./skeleton";
import { NotificationsEmpty } from "./NotificationsEmpty";

export const Notifications = Object.assign(
    async function Notifications({ isArabic }: { isArabic: boolean }) {
        const notifications = await getNotifications(isArabic);

        if (notifications.length === 0) return <NotificationsEmpty isArabic={isArabic} />;

        return <NotificationsClient notifications={notifications} isArabic={isArabic} />;
    },
    { skeleton: NotificationsSkeleton }
);
