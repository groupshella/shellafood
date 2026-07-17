import Image from "@/shared/components/SecureImage";
import { Notification } from "@/features/notifications/types/notifications.types";

function formatTime(dateStr: string, isArabic: boolean): string {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;

	return date
		.toLocaleTimeString(isArabic ? "ar" : "en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
		.toLowerCase();
}

function DeliveryIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="sm:h-8 sm:w-8">
			<circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.5" />
			<path
				d="M5.5 20.5c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9.2 5.2c.4-.9 1.2-1.4 2.1-1.5M14.8 5.2c-.4-.9-1.2-1.4-2.1-1.5"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

type NotificationCardProps = {
	notification: Notification;
	isArabic: boolean;
};

export function NotificationCard({ notification, isArabic }: NotificationCardProps) {
	const imageUrl = notification.image_full_url ?? notification.image;
	const isUnread = notification.status === 0;

	return (
		<article
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			aria-label={
				isUnread
					? isArabic
						? `${notification.title} — غير مقروء`
						: `${notification.title} — unread`
					: notification.title
			}
			className={[
				"flex w-full min-w-0 items-start gap-3 rounded-2xl bg-card px-3.5 py-3.5 sm:gap-3.5 sm:px-4 sm:py-4 lg:rounded-3xl",
				"transition-colors",
			].join(" ")}
		>
			{imageUrl ? (
				<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-background sm:h-14 sm:w-14 sm:rounded-[14px]">
					<Image
						src={imageUrl}
						alt=""
						fill
						className="object-cover"
						sizes="(max-width: 640px) 48px, 56px"
						loading="lazy"
					/>
				</div>
			) : (
				<div
					className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-foreground shadow-sm ring-1 ring-border sm:h-14 sm:w-14 sm:rounded-[14px]"
					aria-hidden
				>
					<DeliveryIcon />
				</div>
			)}

			<div className="min-w-0 flex-1 space-y-1 text-start sm:space-y-1.5">
				<h2 className="line-clamp-1 text-[15px] font-bold leading-snug text-foreground sm:text-base">
					{notification.title}
				</h2>
				<p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-muted sm:text-sm">
					{notification.description}
				</p>
			</div>

			<div className="flex shrink-0 flex-col items-center gap-2 pt-0.5 sm:gap-2.5">
				{isUnread ? (
					<span className="h-2.5 w-2.5 rounded-full bg-brand sm:h-3 sm:w-3" aria-hidden />
				) : (
					<span className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden />
				)}
				<time
					dateTime={notification.created_at}
					className="whitespace-nowrap text-[11px] font-medium text-muted sm:text-xs"
					dir="ltr"
				>
					{formatTime(notification.created_at, isArabic)}
				</time>
			</div>
		</article>
	);
}
