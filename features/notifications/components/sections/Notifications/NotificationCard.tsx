import Image from "next/image";
import { Notification } from "@/features/notifications/types/notifications.types";

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "منذ لحظات";
    if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? "دقيقة" : "دقائق"}`;
    if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`;
    return `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`;
}

interface NotificationCardProps {
    notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
    const imageUrl = notification.image_full_url ?? notification.image;
    const isUnread = notification.status === 0;

    return (
        <article
            className={[
                "flex h-full min-w-0 w-full gap-2.5 rounded-2xl px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5 lg:rounded-3xl",
                "shadow-sm ring-1 ring-black/[0.05] dark:ring-white/[0.06]",
                isUnread
                    ? "bg-[#F6FBF7] ring-[#30913F]/20 dark:bg-[#0d2e12]/60 dark:ring-[#30913F]/30"
                    : "bg-white dark:bg-gray-800",
            ].join(" ")}
            dir="rtl"
            aria-label={isUnread ? `${notification.title} — غير مقروء` : notification.title}
        >
            {imageUrl ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-12 sm:w-12">
                    <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 44px, 48px"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
                        isUnread
                            ? "bg-[#30913F]/10 text-[#30913F] dark:bg-[#30913F]/20 dark:text-[#4db860]"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
                    ].join(" ")}
                    aria-hidden
                >
                    <span className="text-base font-bold sm:text-lg">{notification.title?.charAt(0)}</span>
                </div>
            )}

            <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                        {notification.title}
                    </h2>
                    {isUnread && (
                        <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#30913F] sm:mt-2 sm:h-2.5 sm:w-2.5"
                            aria-hidden
                        />
                    )}
                </div>
                <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    {notification.description}
                </p>
                <time className="text-[11px] text-gray-400 dark:text-gray-500 sm:text-xs" dateTime={notification.created_at}>
                    {timeAgo(notification.created_at)}
                </time>
            </div>
        </article>
    );
}
