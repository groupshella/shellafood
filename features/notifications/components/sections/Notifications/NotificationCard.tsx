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
                "flex w-full gap-3 rounded-2xl bg-white px-4 py-3.5",
                "shadow-sm ring-1 ring-black/[0.05]",
                isUnread ? "ring-[#30913F]/20 bg-[#F6FBF7]" : "",
            ].join(" ")}
            dir="rtl"
        >
            {imageUrl ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div
                    className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                        isUnread ? "bg-[#30913F]/10 text-[#30913F]" : "bg-gray-100 text-gray-400",
                    ].join(" ")}
                    aria-hidden
                >
                    <span className="text-lg font-bold">{notification.title.charAt(0)}</span>
                </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-[15px] font-bold text-gray-900">{notification.title}</h2>
                    {isUnread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#30913F]" aria-label="غير مقروء" />
                    )}
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">{notification.description}</p>
                <time className="text-xs text-gray-400" dateTime={notification.created_at}>
                    {timeAgo(notification.created_at)}
                </time>
            </div>
        </article>
    );
}
